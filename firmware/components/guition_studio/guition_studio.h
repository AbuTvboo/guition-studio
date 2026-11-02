#pragma once

#include <array>
#include <cstdint>
#include <map>
#include <string>
#include <vector>

#include "esphome/core/automation.h"
#include "esphome/core/component.h"
#include "esphome/core/defines.h"
#include "esphome/core/helpers.h"

#ifdef USE_LIGHT
#include "esphome/components/light/light_state.h"
#endif
#ifdef USE_TIME
#include "esphome/components/time/real_time_clock.h"
#endif

#ifdef USE_GS_SLIDESHOW
#include "esphome/components/online_image/online_image.h"
#endif
#ifdef USE_GS_PRAYER_BG
#include "esphome/components/image/image.h"
#endif

#include "esphome/components/lvgl/lvgl_esphome.h"
#include "esphome/components/touchscreen/touchscreen.h"
#include <lvgl.h>

#if LVGL_VERSION_MAJOR < 9
typedef lv_img_dsc_t lv_image_dsc_t;  // NOLINT
#define lv_image_create lv_img_create
#endif

namespace esphome {
namespace guition_studio {

// Must match custom_components/guition_studio/const.py and frontend/src/geometry.ts
static constexpr int PROTOCOL_VERSION = 5;
static constexpr int SCREEN_W = 480;
static constexpr int SCREEN_H = 480;
static constexpr int HEADER_H = 44;
static constexpr int DOTS_H = 22;
static constexpr int MARGIN = 8;
static constexpr int GAP = 8;
static constexpr int MAX_PAGES = 10;
static constexpr int MAX_GRID = 6;
static constexpr int MAX_TILES_TOTAL = 160;

enum TileAction : uint8_t {
  ACTION_NONE = 0,
  ACTION_REMOTE = 1,    // handled by Home Assistant (toggle, service call ...)
  ACTION_NAVIGATE = 2,  // local: go to page index
  ACTION_HOME = 3,
  ACTION_BACK = 4,
  ACTION_NEXT = 5,
  ACTION_PREV = 6,
  ACTION_SETTINGS = 7,  // local: open the settings menu
  ACTION_COLOR = 8,     // local: open the colour picker of an RGB tile
};

// One entity of a swipe tile.
struct SwipeItem {
  std::string entity;
  std::string title;
  std::string icon;
};
static constexpr int MAX_SWIPE_ITEMS = 4;

struct TileCfg {
  std::string id;
  std::string kind;
  std::string entity;
  std::string title;
  std::string icon;
  std::string fmt;
  int x{0}, y{0}, w{1}, h{1};
  uint32_t bg{0x1E2630}, fg{0xFFFFFF}, icon_color{0xFFFFFF}, on_bg{0xFFB300}, on_fg{0x101010};
  uint32_t border_color{0x000000};
  uint8_t font{1}, radius{16}, border{0}, opacity{100};
  bool show_title{true}, show_state{true}, show_icon{true};
  uint8_t tap{ACTION_NONE}, hold{ACTION_NONE};
  int tap_page{-1}, hold_page{-1};
  uint8_t wopts{0x2F};  // weather: 1 condition, 2 high/low, 4 humidity, 8 wind, 16 pressure, 32 forecast
  std::vector<SwipeItem> items;  // swipe tile: entities shown one at a time
  bool vertical{false};          // swipe tile: swipe up/down instead of left/right
};

struct PageCfg {
  std::string id;
  std::string name;
  uint32_t bg{0x0B0F14};
  int cols{3}, rows{3};
  std::vector<TileCfg> tiles;
};

struct LayoutCfg {
  int revision{0};
  int brightness{80};       // percent
  int standby{10};          // percent
  int timeout_s{60};        // 0 = never dim
  int home_after_s{0};      // 0 = never return to home page
  int home{0};
  bool header{true};
  bool dots{true};
  bool swipe{true};
  uint32_t header_bg{0x0B0F14}, header_fg{0xE6EDF3}, muted{0x8B98A5}, accent{0x3D8BFD};
  uint32_t ok_color{0x2EA043}, err_color{0xF85149};
  std::string txt_unavailable{"Nicht verfügbar"};
  int screensaver_s{0};                     // 0 = off
  std::vector<std::string> ss_entities;     // up to 2 entities shown on the screensaver
  std::vector<std::string> ss_titles;
  int night_brightness{15}, night_dim{30};
  int rotation{0};  // 0, 90, 180, 270 degrees
  int touch_mode{0};  // 0 standard, 1 rotated 180, 2 mirrored left/right, 3 mirrored up/down
  bool slideshow{false};       // screensaver shows pictures streamed from HA
  std::string slide_url;       // base URL incl. per-display token (no query string)
  int slide_interval{15};      // seconds
  bool slide_clock{true};
  // screensaver mode 2: Islamic prayer times (timestamp sensors, shown as HH:MM by HA)
  bool prayer{false};
  std::vector<std::string> prayer_names, prayer_entities;
  std::vector<uint8_t> prayer_kind;  // 1 = prayer, 0 = sunrise (orientation only)
  // countdown line: prefix, separator, hour unit, minute unit, "now" prefix (language from HA)
  std::array<std::string, 5> prayer_text{"Nächstes Gebet:", " in ", "h", "min", "Jetzt:"};
  int prayer_bg{1};  // calligraphy background: 0 = none, n = n-th picture built into the firmware
  std::string theme;
  std::vector<std::pair<std::string, std::string>> themes;  // id, name
  std::vector<PageCfg> pages;
};

struct EntityState {
  bool on{false};
  bool available{true};
  bool known{false};
  int num{-1};          // 0..100: brightness, cover position, volume (-1 = none)
  std::string display;  // main text
  std::string sub;      // secondary text (target temperature, media title, weather condition)
  std::string icon;     // icon override (weather condition)
  std::vector<int8_t> graph;  // history 0..100, -1 = no data (graph tiles)
  std::string graph_range;    // "min – max unit"
  std::string detail;         // weather (firmware < 0.5.6 format): combined detail line
  std::string hilo, humidity, wind, pressure;  // weather parts, combined per tile options
  std::vector<std::array<std::string, 3>> forecast;  // weather: weekday, icon, "hi°/lo°"
};

// Sub-controls inside a tile (cover, thermostat, media). Sent to HA as names.
enum ButtonCode : uint8_t {
  BTN_UP = 1,
  BTN_STOP = 2,
  BTN_DOWN = 3,
  BTN_MINUS = 4,
  BTN_PLUS = 5,
  BTN_PREV = 6,
  BTN_PLAY = 7,
  BTN_NEXT = 8,
  BTN_VOL_DOWN = 9,
  BTN_VOL_UP = 10,
  BTN_C1 = 11,  // RGB swatches c1..c5
  BTN_C5 = 15,
};

struct TileView {
  int page{0};
  const TileCfg *cfg{nullptr};
  lv_obj_t *obj{nullptr};
  lv_obj_t *icon{nullptr};
  lv_obj_t *title{nullptr};
  lv_obj_t *value{nullptr};
  lv_obj_t *sub{nullptr};
  lv_obj_t *slider{nullptr};
  lv_obj_t *graph_area{nullptr};
  lv_obj_t *detail{nullptr};
  lv_obj_t *fc_day[3]{nullptr, nullptr, nullptr}, *fc_icon[3]{nullptr, nullptr, nullptr}, *fc_temp[3]{nullptr, nullptr, nullptr};
  std::vector<lv_obj_t *> bars;
  // swipe tile: shown item, sliding content container, position dots
  int item{0};
  lv_obj_t *content{nullptr};
  lv_obj_t *dots[MAX_SWIPE_ITEMS]{};
  bool drag_on{false};   // the finger is dragging the content
  int drag{0};           // current offset along the swipe axis
  int pending_step{0};   // item change waiting for the slide-out animation
  bool dragging{false};
  bool visible{true};
};

class GuitionStudio : public Component {
 public:
  void setup() override;
  void loop() override;
  void dump_config() override;
  float get_setup_priority() const override { return setup_priority::LATE; }

  void set_hardware(const std::string &hw) { this->hardware_ = hw; }
  void set_max_layout_size(uint32_t size) { this->max_layout_size_ = size; }
  void set_lvgl(lvgl::LvglComponent *lv) { this->lvgl_ = lv; }
  void set_touchscreen(touchscreen::Touchscreen *ts) { this->touch_ = ts; }
#ifdef USE_LIGHT
  void set_backlight(light::LightState *bl) { this->backlight_ = bl; }
#endif
#ifdef USE_TIME
  void set_time(time::RealTimeClock *t) { this->time_ = t; }
#endif
#ifdef USE_GS_SLIDESHOW
  void set_slideshow_image(online_image::OnlineImage *img) { this->slide_img_ = img; }
#endif
#ifdef USE_GS_PRAYER_BG
  void add_prayer_background(image::Image *img) { this->prayer_bgs_.push_back(img); }
#endif
  void add_on_event_callback(std::function<void(const std::string &, const std::string &)> &&cb) {
    this->event_callbacks_.add(std::move(cb));
  }

  // ---- API actions (called from YAML `api: actions:`) ----
  void layout_begin(int32_t session, int32_t total, int32_t crc);
  void layout_chunk(int32_t session, int32_t index, const std::string &data);
  void layout_commit(int32_t session);
  void set_states(const std::string &json);
  void show_page(int32_t index);
  void notify(const std::string &title, const std::string &message, int32_t seconds);
  void rollback();
  void send_hello();
  void set_mode(int32_t night, int32_t brightness, int32_t dim);
  /// OTA progress screen: state 0 = running (progress 0..100), 1 = done, 2 = failed
  void ota_status(int state, float progress);
  void on_color_event(int code, lv_event_code_t event, lv_obj_t *target);
  void emit(const std::string &type, const std::string &payload);

  // LVGL event entry points
  void on_tile_event(int index, lv_event_code_t code);
  void on_root_event(lv_event_code_t code);
  void on_button_event(int index, uint8_t button, lv_event_code_t code);
  void on_slider_event(int index, lv_event_code_t code);
  void on_menu_event(int code, lv_event_code_t event, lv_obj_t *target);
  void on_header_event(lv_event_code_t code);

 protected:
  bool parse_layout_(const char *data, size_t len, LayoutCfg &out, std::string &err);
  bool load_from_nvs_(const char *key, const char *crc_key);
  bool save_to_nvs_(const char *data, size_t len, uint32_t crc);
  void build_ui_();
  void build_default_ui_();
  void build_tile_(int page_index, lv_obj_t *parent, const TileCfg &tile);
  void add_buttons_(int index, lv_obj_t *tile, const TileCfg &t, const uint8_t *codes, int count, int pad, int pw, int ph);
  bool begin_press_();
  void add_swatches_(int index, lv_obj_t *tile, int pad, int pw, int bottom, int height);
  void update_graph_(TileView &view, const EntityState *st);
  void show_screensaver_();
  void hide_screensaver_();
  void update_screensaver_(const std::string &hhmm, const std::string &date);
  void build_prayer_screensaver_(lv_obj_t *parent);
  void update_prayer_(const std::string &hhmm);
  void apply_night_overlay_();
  void slide_next_();
  void slide_ready_();
  void slide_failed_();
  void slide_stop_();
  void open_color_picker_(int view_index);
  void close_color_picker_();
  int effective_brightness_() const;
  // effective settings = layout + local overrides from the on-device menu
  int brightness_() const { return this->ovr_br_ >= 0 ? this->ovr_br_ : this->layout_.brightness; }
  int standby_() const { return this->ovr_sb_ >= 0 ? this->ovr_sb_ : this->layout_.standby; }
  int timeout_() const { return this->ovr_to_ >= 0 ? this->ovr_to_ : this->layout_.timeout_s; }
  int screensaver_s_() const;
  int rotation_() const { return this->ovr_rot_ >= 0 ? this->ovr_rot_ : this->layout_.rotation; }
  void apply_rotation_();
  void apply_touch_mode_();
  void load_overrides_();
  void save_overrides_();
  void clear_overrides_();
  void report_setting_(const char *key, int value);
  void report_setting_(const char *key, const std::string &value);
  void open_settings_();
  void close_settings_();
  void refresh_settings_();
  void hold_begin_();
  void hold_cancel_();
  void hold_update_(uint32_t now);
  void update_tile_(TileView &view);
  void swipe_item_(int index, int step);
  void swipe_animate_(TileView &view, int from, int to, uint32_t ms, bool out);
  void swipe_finish_(TileView &view);
 public:
  void on_swipe_out_done(lv_obj_t *content);
 protected:
  void update_status_();
  void show_page_(int index, bool remember);
  void handle_gesture_();
  void do_action_(TileView &view, uint8_t action, int page, bool hold);
  void set_backlight_(int percent);
  void wake_();
  void close_notification_();
  void ack_(int32_t session, bool ok, const std::string &err);
  void free_rx_();

  std::string hardware_;
  uint32_t max_layout_size_{32768};
#ifdef USE_LIGHT
  light::LightState *backlight_{nullptr};
#endif
#ifdef USE_TIME
  time::RealTimeClock *time_{nullptr};
#endif
  CallbackManager<void(const std::string &, const std::string &)> event_callbacks_;

  LayoutCfg layout_;
  bool has_layout_{false};
  uint32_t layout_crc_{0};
  bool ui_dirty_{true};
  std::string boot_error_;

  // receive state
  int32_t rx_session_{0};
  uint32_t rx_total_{0};
  uint32_t rx_crc_{0};
  uint32_t rx_len_{0};
  int32_t rx_next_index_{0};
  char *rx_buf_{nullptr};
  bool rx_failed_{false};
  std::string rx_error_;

  // ui state
  lv_obj_t *root_{nullptr};
  lv_obj_t *header_title_{nullptr};
  lv_obj_t *header_clock_{nullptr};
  lv_obj_t *header_wifi_{nullptr};
  lv_obj_t *header_ha_{nullptr};
  lv_obj_t *notify_obj_{nullptr};
  uint32_t notify_until_{0};
  std::vector<lv_obj_t *> page_objs_;
  std::vector<lv_obj_t *> dot_objs_;
  std::vector<TileView> views_;
  std::map<std::string, std::vector<int>> entity_views_;
  std::map<std::string, int> tile_index_;
  std::map<std::string, EntityState> states_;
  std::vector<int> history_;
  int current_page_{0};
  int page_h_{SCREEN_H};

  // interaction state
  bool dimmed_{false};
  bool swallow_{false};
  bool gesture_{false};
  // start of the current touch; a touch that moved too far is a swipe, never a tap
  lv_point_t press_start_{};
  bool press_moved_{false};
  bool returned_home_{true};
  uint32_t last_tick_{0};
  uint32_t last_idle_check_{0};
  uint32_t last_heartbeat_{0};

  // night mode (set by Home Assistant via gs_mode) and screensaver
  bool night_{false};
  int night_brightness_{15};
  int night_dim_{0};
  lv_obj_t *night_obj_{nullptr};
  lv_obj_t *ss_obj_{nullptr};
  lv_obj_t *ss_clock_{nullptr};
  lv_obj_t *ss_date_{nullptr};
  lv_obj_t *ss_lines_[2]{nullptr, nullptr};
  static const int MAX_PRAYER_ROWS = 6;
  lv_obj_t *ss_next_{nullptr};
  lv_obj_t *ss_prow_[MAX_PRAYER_ROWS]{};
  lv_obj_t *ss_pname_[MAX_PRAYER_ROWS]{};
  lv_obj_t *ss_ptime_[MAX_PRAYER_ROWS]{};
  std::string ss_prayer_sig_;
  bool ss_prayer_gold_{false};  // gold highlight on the calligraphy background
#ifdef USE_GS_PRAYER_BG
  std::vector<image::Image *> prayer_bgs_;
#endif

  // local overrides (-1 = use layout), persisted in NVS key "ovr"
  int ovr_br_{-1}, ovr_sb_{-1}, ovr_to_{-1}, ovr_ss_{-1}, ovr_rot_{-1};
  int applied_rotation_{-1};
  lvgl::LvglComponent *lvgl_{nullptr};
  touchscreen::Touchscreen *touch_{nullptr};
  int applied_touch_mode_{-1};

  // on-device settings menu
  lv_obj_t *header_hit_{nullptr};
  // hold 3 s on the header or any empty area to open the settings menu (yellow edge glow as feedback)
  bool hold_active_{false};
  uint32_t hold_start_{0};
  lv_obj_t *hold_glow_{nullptr};
  lv_obj_t *menu_obj_{nullptr};
  lv_obj_t *menu_br_lbl_{nullptr}, *menu_sb_lbl_{nullptr}, *menu_night_lbl_{nullptr}, *menu_ss_lbl_{nullptr};
  lv_obj_t *menu_info_lbl_{nullptr}, *menu_restart_lbl_{nullptr}, *menu_status_lbl_{nullptr};
  lv_obj_t *menu_night_btn_{nullptr}, *menu_ss_btn_{nullptr};
  std::vector<lv_obj_t *> menu_timeout_btns_, menu_theme_btns_, menu_home_btns_, menu_rot_btns_;
  uint32_t restart_armed_until_{0};

  // screensaver slideshow: two PSRAM buffers, the next picture decodes in the background
#ifdef USE_GS_SLIDESHOW
  online_image::OnlineImage *slide_img_{nullptr};
#endif
  lv_obj_t *ss_img_{nullptr};
  uint8_t *slide_buf_[2]{nullptr, nullptr};
  lv_image_dsc_t slide_dsc_[2]{};
  int slide_front_{-1};
  bool slide_pending_{false};
  uint32_t slide_next_at_{0};
  uint32_t slide_counter_{0};
  uint8_t slide_errors_{0};

  // firmware update screen
  lv_obj_t *ota_obj_{nullptr}, *ota_fill_{nullptr}, *ota_title_{nullptr}, *ota_sub_{nullptr}, *ota_pct_{nullptr};
  int ota_last_pct_{-1};

  // colour picker popup (RGB tiles, opened by long press)
  lv_obj_t *color_obj_{nullptr};
  int color_tile_{-1};
  uint32_t ota_hide_at_{0};
};

class EventTrigger : public Trigger<std::string, std::string> {
 public:
  explicit EventTrigger(GuitionStudio *parent) {
    parent->add_on_event_callback(
        [this](const std::string &type, const std::string &payload) { this->trigger(type, payload); });
  }
};

uint32_t crc32(const uint8_t *data, size_t len);

}  // namespace guition_studio
}  // namespace esphome
