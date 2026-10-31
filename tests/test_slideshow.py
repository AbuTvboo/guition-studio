from io import BytesIO
import json

from PIL import Image
import pytest

from gs_pure.layout import compile_device_layout, default_layout, validate_layout, LayoutValidationError
from gs_pure.slideshow import SlideshowSource, list_folders, list_images, render_picture, resolve_folder


def _make_pictures(folder, sizes):
    folder.mkdir(parents=True, exist_ok=True)
    for i, (w, h) in enumerate(sizes):
        Image.new("RGB", (w, h), (i * 40 % 255, 100, 200)).save(folder / f"p{i}.jpg")


def test_resolve_folder_blocks_traversal(tmp_path):
    root = tmp_path / "media"
    (root / "fotos").mkdir(parents=True)
    assert resolve_folder(root, "fotos") == (root / "fotos").resolve()
    assert resolve_folder(root, "") == root.resolve()
    assert resolve_folder(root, "../etc") is None
    assert resolve_folder(root, "fotos/../../x") is None
    assert resolve_folder(root, "a;rm -rf") is None


def test_render_is_480_baseline_jpeg(tmp_path):
    _make_pictures(tmp_path, [(1600, 900)])
    data = render_picture(tmp_path / "p0.jpg", "cover")
    img = Image.open(BytesIO(data))
    assert img.format == "JPEG" and img.size == (480, 480)
    assert not img.info.get("progressive")  # ESPHome's JPEGDEC cannot decode progressive JPEGs
    assert len(data) < 120_000
    padded = Image.open(BytesIO(render_picture(tmp_path / "p0.jpg", "contain")))
    assert padded.getpixel((240, 2)) == (0, 0, 0)  # letterbox bar


def test_png_with_alpha(tmp_path):
    Image.new("RGBA", (300, 300), (255, 0, 0, 0)).save(tmp_path / "a.png")
    img = Image.open(BytesIO(render_picture(tmp_path / "a.png")))
    assert img.mode == "RGB" and img.size == (480, 480)


def test_sequential_and_random_order(tmp_path):
    _make_pictures(tmp_path / "f", [(500, 500)] * 3)
    src = SlideshowSource()
    seq = [src.next_picture("d1", tmp_path / "f", "sequential", "cover") for _ in range(4)]
    assert seq[0] == seq[3] and seq[0] != seq[1]
    rnd = {src.next_picture("d2", tmp_path / "f", "random", "cover") for _ in range(3)}
    assert len(rnd) == 3  # every picture once per round
    assert src.next_picture("d3", tmp_path / "empty", "random", "cover") is None


def test_listing(tmp_path):
    _make_pictures(tmp_path / "urlaub", [(10, 10), (10, 10)])
    (tmp_path / "urlaub" / "notes.txt").write_text("x")
    assert len(list_images(tmp_path / "urlaub")) == 2
    folders = {f["folder"]: f["count"] for f in list_folders(tmp_path)}
    assert folders["urlaub"] == 2 and folders[""] == 0


def test_slideshow_settings_and_device_fields():
    layout = default_layout()
    layout["settings"]["screensaver"] = {"enabled": True, "after": 60, "entities": [], "mode": "slideshow", "folder": "fotos/urlaub", "interval": 20, "order": "sequential", "fit": "contain", "show_clock": False}
    valid = validate_layout(layout)
    doc = json.loads(compile_device_layout(valid, "http://ha:8123/api/guition_studio/slide/d_1/tok/next.jpg")[0])
    assert doc["set"]["ssm"] == 1 and doc["set"]["sli"] == 20 and doc["set"]["slc"] == 0
    assert doc["set"]["slu"].endswith("/next.jpg")
    # without URL (no internal HA URL) the display falls back to the clock screensaver
    assert "ssm" not in json.loads(compile_device_layout(valid)[0])["set"]
    layout["settings"]["screensaver"]["folder"] = "../geheim"
    with pytest.raises(LayoutValidationError):
        validate_layout(layout)
