"""Guition Studio runtime layout engine for ESPHome.

Builds LVGL pages and tiles at runtime from a versioned JSON layout that is
transferred from Home Assistant through native API actions. No re-flash is
needed to change pages or tiles.
"""

from esphome import automation
import esphome.codegen as cg
from esphome.components import light
from esphome.components import time as time_
import esphome.config_validation as cv
from esphome.const import CONF_ID, CONF_TIME_ID, CONF_TRIGGER_ID

DEPENDENCIES = ["lvgl", "api", "network"]
AUTO_LOAD = ["json"]
MULTI_CONF = False

CONF_BACKLIGHT = "backlight"
CONF_ON_EVENT = "on_event"
CONF_MAX_LAYOUT_SIZE = "max_layout_size"
CONF_HARDWARE = "hardware"

gs_ns = cg.esphome_ns.namespace("guition_studio")
GuitionStudio = gs_ns.class_("GuitionStudio", cg.Component)
EventTrigger = gs_ns.class_(
    "EventTrigger", automation.Trigger.template(cg.std_string, cg.std_string)
)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(GuitionStudio),
        cv.Optional(CONF_BACKLIGHT): cv.use_id(light.LightState),
        cv.Optional(CONF_TIME_ID): cv.use_id(time_.RealTimeClock),
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
    cg.add(var.set_max_layout_size(config[CONF_MAX_LAYOUT_SIZE]))
    if CONF_BACKLIGHT in config:
        bl = await cg.get_variable(config[CONF_BACKLIGHT])
        cg.add(var.set_backlight(bl))
    if CONF_TIME_ID in config:
        clock = await cg.get_variable(config[CONF_TIME_ID])
        cg.add(var.set_time(clock))
    for conf in config.get(CONF_ON_EVENT, []):
        trigger = cg.new_Pvariable(conf[CONF_TRIGGER_ID], var)
        await automation.build_automation(
            trigger, [(cg.std_string, "type"), (cg.std_string, "payload")], conf
        )
