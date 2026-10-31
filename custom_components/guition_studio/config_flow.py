"""Config flow for Guition Studio (single instance)."""

from __future__ import annotations

import re
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback

from .const import CONF_FIRMWARE_REPO, DEFAULT_FIRMWARE_REPO, DOMAIN

REPO_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")


class GuitionStudioConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        errors: dict[str, str] = {}
        if user_input is not None:
            if not REPO_RE.match(user_input[CONF_FIRMWARE_REPO]):
                errors[CONF_FIRMWARE_REPO] = "invalid_repo"
            else:
                return self.async_create_entry(title="Guition Studio", data=user_input)
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_FIRMWARE_REPO, default=DEFAULT_FIRMWARE_REPO): str}),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return GuitionStudioOptionsFlow()


class GuitionStudioOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            if not REPO_RE.match(user_input[CONF_FIRMWARE_REPO]):
                errors[CONF_FIRMWARE_REPO] = "invalid_repo"
            else:
                return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(
            CONF_FIRMWARE_REPO, self.config_entry.data.get(CONF_FIRMWARE_REPO, DEFAULT_FIRMWARE_REPO)
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({vol.Required(CONF_FIRMWARE_REPO, default=current): str}),
            errors=errors,
        )
