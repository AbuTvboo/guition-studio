"""Guition Studio runtime layout engine for ESPHome.

Builds LVGL pages and tiles at runtime from a versioned JSON layout that is
transferred from Home Assistant through native API actions. No re-flash is
needed to change pages or tiles.
"""

from esphome import automation
import esphome.codegen as cg
from esphome.components import image, light
from esphome.components import time as time_
from esphome.components import touchscreen
import esphome.config_validation as cv
from esphome.const import CONF_ID, CONF_TIME_ID, CONF_TRIGGER_ID

DEPENDENCIES = ["lvgl", "api", "network"]
AUTO_LOAD = ["json"]
MULTI_CONF = False

CONF_BACKLIGHT = "backlight"
CONF_ON_EVENT = "on_event"
CONF_MAX_LAYOUT_SIZE = "max_layout_size"
CONF_HARDWARE = "hardware"
CONF_SLIDESHOW_IMAGE = "slideshow_image"
CONF_PRAYER_BACKGROUND = "prayer_background"
CONF_LVGL_ID = "lvgl_id"
CONF_TOUCHSCREEN_ID = "touchscreen_id"

gs_ns = cg.esphome_ns.namespace("guition_studio")
OnlineImage = cg.esphome_ns.namespace("online_image").class_("OnlineImage")
LvglComponent = cg.esphome_ns.namespace("lvgl").class_("LvglComponent")
GuitionStudio = gs_ns.class_("GuitionStudio", cg.Component)
EventTrigger = gs_ns.class_(
    "EventTrigger", automation.Trigger.template(cg.std_string, cg.std_string)
)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(GuitionStudio),
        # runtime screen rotation (requires `rotation:` in the lvgl config)
        cv.GenerateID(CONF_LVGL_ID): cv.use_id(LvglComponent),
        # touch orientation correction selectable in Guition Studio (no re-flash)
        cv.Optional(CONF_TOUCHSCREEN_ID): cv.use_id(touchscreen.Touchscreen),
        cv.Optional(CONF_BACKLIGHT): cv.use_id(light.LightState),
        cv.Optional(CONF_TIME_ID): cv.use_id(time_.RealTimeClock),
        # online_image used to stream screensaver slideshow pictures from Home Assistant
        cv.Optional(CONF_SLIDESHOW_IMAGE): cv.use_id(OnlineImage),
        # static picture behind the prayer times screensaver (calligraphy)
        cv.Optional(CONF_PRAYER_BACKGROUND): cv.use_id(image.Image_),
        cv.Optional(CONF_HARDWARE, default="guition-4848s040"): cv.string_strict,
        cv.Optional(CONF_MAX_LAYOUT_SIZE, default=32768): cv.int_range(
            min=1024, max=131072
        ),
        cv.Optional(CONF_ON_EVENT): automation.validate_automation(
            {cv.GenerateID(CONF_TRIGGER_ID): cv.declare_id(EventTrigger)}
        ),
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    cg.add(var.set_hardware(config[CONF_HARDWARE]))
    lv_comp = await cg.get_variable(config[CONF_LVGL_ID])
    cg.add(var.set_lvgl(lv_comp))
    if CONF_TOUCHSCREEN_ID in config:
        ts = await cg.get_variable(config[CONF_TOUCHSCREEN_ID])
        cg.add(var.set_touchscreen(ts))
    cg.add(var.set_max_layout_size(config[CONF_MAX_LAYOUT_SIZE]))
    if CONF_BACKLIGHT in config:
        bl = await cg.get_variable(config[CONF_BACKLIGHT])
        cg.add(var.set_backlight(bl))
    if CONF_TIME_ID in config:
        clock = await cg.get_variable(config[CONF_TIME_ID])
        cg.add(var.set_time(clock))
    if CONF_SLIDESHOW_IMAGE in config:
        img = await cg.get_variable(config[CONF_SLIDESHOW_IMAGE])
        cg.add_define("USE_GS_SLIDESHOW")
        cg.add(var.set_slideshow_image(img))
    if CONF_PRAYER_BACKGROUND in config:
        bg = await cg.get_variable(config[CONF_PRAYER_BACKGROUND])
        cg.add_define("USE_GS_PRAYER_BG")
        cg.add(var.set_prayer_background(bg))
    for conf in config.get(CONF_ON_EVENT, []):
        trigger = cg.new_Pvariable(conf[CONF_TRIGGER_ID], var)
        await automation.build_automation(
            trigger, [(cg.std_string, "type"), (cg.std_string, "payload")], conf
        )
