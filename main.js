/**
 * An array of status effect icons which can be applied to Tokens
 * @type {Array}
 */
Hooks.once("init", function () {
  if (isNewerVersion('0.7.4', game.data.version)) {
    CONFIG.statusEffects = [
      "modules/misfits-conditions5e/icons/dead.svg",
      "modules/misfits-conditions5e/icons/unconscious.svg",
      "modules/misfits-conditions5e/icons/stunned.svg",
      "modules/misfits-conditions5e/icons/exhaustion1.svg",
  
      "modules/misfits-conditions5e/icons/incapacitated.svg",
      "modules/misfits-conditions5e/icons/paralyzed.svg",
      "modules/misfits-conditions5e/icons/petrified.svg",
      "modules/misfits-conditions5e/icons/exhaustion2.svg",
  
      "modules/misfits-conditions5e/icons/grappled.svg",
      "modules/misfits-conditions5e/icons/restrained.svg",
      "modules/misfits-conditions5e/icons/prone.svg",
      "modules/misfits-conditions5e/icons/exhaustion3.svg",
  
      "modules/misfits-conditions5e/icons/charmed.svg",
      "modules/misfits-conditions5e/icons/frightened.svg",
      "modules/misfits-conditions5e/icons/poisoned.svg",
      "modules/misfits-conditions5e/icons/exhaustion4.svg",
  
      "modules/misfits-conditions5e/icons/blinded.svg",
      "modules/misfits-conditions5e/icons/deafened.svg",
      "modules/misfits-conditions5e/icons/diseased.svg",
      "modules/misfits-conditions5e/icons/exhaustion5.svg"
    ];
  } else {
    CONFIG.statusEffects = [
      {
        id: "dead",
        label: "EFFECT.StatusDead",
        icon: "modules/misfits-conditions5e/icons/dead.svg"
      },
      {
        id: "concentrating",
        label: "EFFECT.StatusConcentrating",
        icon: "modules/misfits-conditions5e/icons/1_Concentrating.svg"
      },
      {
        id: "grappled",
        label: "EFFECT.StatusGrappled",
        icon: "modules/misfits-conditions5e/icons/2_Grappled.svg",
      },
      {
        id: "prone",
        label: "EFFECT.StatusProne",
        icon: "modules/misfits-conditions5e/icons/3_Prone.svg"
      },
      {
        id: "restrain",
        label: "EFFECT.StatusRestrained",
        icon: "modules/misfits-conditions5e/icons/4_Restrained.svg",
      },
      {
        id: "unconscious",
        label: "EFFECT.StatusUnconscious",
        icon: "modules/misfits-conditions5e/icons/5_Unconscious.svg"
      },
      {
        id: "blind",
        label: "EFFECT.StatusBlind",
        icon: "modules/misfits-conditions5e/icons/6_Blinded.svg"
      },
      {
        id: "burning",
        label: "EFFECT.StatusBurning",
        icon: "modules/misfits-conditions5e/icons/7_Burning.svg"
      },
      {
        id: "charmed",
        label: "EFFECT.StatusCharmed",
        icon: "modules/misfits-conditions5e/icons/8_Charmed.svg"
      },
      {
        id: "deaf",
        label: "EFFECT.StatusDeaf",
        icon: "modules/misfits-conditions5e/icons/9_Deafened.svg"
      },
      {
        id: "exhaustion",
        label: "EFFECT.StatusExhausted",
        icon: "modules/misfits-conditions5e/icons/10_Exhausted.svg"
      },
      {
        id: "fear",
        label: "EFFECT.StatusFear",
        icon: "modules/misfits-conditions5e/icons/11_Feared.svg"
      },
      {
        id: "disarmed",
        label: "EFFECT.StatusDisarmed",
        icon: "modules/misfits-conditions5e/icons/12_Disarmed.svg"
      },
      {
        id: "incapacitated",
        label: "EFFECT.StatusIncapacitated",
        icon: "modules/misfits-conditions5e/icons/13_Incapacitated.svg"
      },
      {
        id: "mute",
        label: "EFFECT.StatusMute",
        icon: "modules/misfits-conditions5e/icons/14_Mute.svg"
      },
      {
        id: "paralysis",
        label: "EFFECT.StatusParalysis",
        icon: "modules/misfits-conditions5e/icons/15_Paralyzed.svg",
      },
      {
        id: "petrified",
        label: "EFFECT.StatusPetrified",
        icon: "modules/misfits-conditions5e/icons/16_Petrified.svg",
      },
      {
        id: "poison",
        label: "EFFECT.StatusPoison",
        icon: "modules/misfits-conditions5e/icons/17_Poisoned.svg"
      },
      {
        id: "sleeping",
        label: "EFFECT.StatusSleeping",
        icon: "modules/misfits-conditions5e/icons/18_Sleeping.svg"
      },
      {
        id: "stun",
        label: "EFFECT.StatusStunned",
        icon: "modules/misfits-conditions5e/icons/19_Stunned.svg"
      },
    ];
  }

  // Replace selected control icons
  CONFIG.controlIcons.visibility = "modules/misfits-conditions5e/icons/32_Invisible.svg";
  CONFIG.controlIcons.defeated = "modules/misfits-conditions5e/icons/dead.svg";
});

// Patch CombatTracker to work with token HUD overlay
// toggleOverlay deprecated in 0.7.4
// Patch not required after 0.7.4
Hooks.once("ready", function () {
  if (isNewerVersion('0.7.4', game.data.version)) {
    let newClass = CombatTracker;
    newClass = trPatchLib.patchMethod(newClass, "_onCombatantControl", 21,
      `if ( isDefeated && !token.data.overlayEffect ) token.toggleOverlay(CONFIG.controlIcons.defeated);`,
      `if ( isDefeated && token.data.overlayEffect !== CONFIG.controlIcons.defeated ) token.toggleOverlay(CONFIG.controlIcons.defeated);`);
    if (!newClass) return;
    CombatTracker.prototype._onCombatantControl = newClass.prototype._onCombatantControl;
  } else if (isNewerVersion('0.7.5', game.data.version)) {
    let newClass = CombatTracker;
    newClass = trPatchLib.patchMethod(newClass, "_onCombatantControl", 21,
      `if ( isDefeated && !token.data.overlayEffect ) token.toggleEffect(CONFIG.controlIcons.defeated, {overlay: true});`,
      `if ( isDefeated && token.data.overlayEffect !== CONFIG.controlIcons.defeated ) token.toggleEffect(CONFIG.controlIcons.defeated, {overlay: true});`);
    if (!newClass) return;
    CombatTracker.prototype._onCombatantControl = newClass.prototype._onCombatantControl;
  }
});

// Function to use token overlay to show status as wounded, unconscious, or dead
Token.prototype._updateHealthOverlay = function () {
  let maxHP = this.actor.data.data.attributes.hp.max;
  let curHP = this.actor.data.data.attributes.hp.value;
  let priorHealth = this.data.overlayEffect;
  let newHealth = null;
  if (curHP <= 0) {
    if (priorHealth === "modules/misfits-conditions5e/icons/dead.svg") newHealth = priorHealth;
    else newHealth = "modules/misfits-conditions5e/icons/almostdead.svg";
  } else if (curHP / maxHP < 0.5) newHealth = "modules/misfits-conditions5e/icons/wounded.svg";
  // toggleOverlay deprecated in 0.7.4
  if (newHealth !== priorHealth) {
    if (isNewerVersion('0.7.4', game.data.version)) {
      if (newHealth === null) this.toggleOverlay(priorHealth);
      else this.toggleOverlay(newHealth);
    } else {
      if (newHealth === null) this.toggleEffect(priorHealth, { overlay: true });
      else this.toggleEffect(newHealth, { overlay: true });
    }
  }
};

// This hook is required for Tokens NOT linked to an Actor
Hooks.on("updateToken", (scene, tokenData, update, options, userId) => {
  let token = canvas.tokens.get(update._id);
  if (token.owner) token._updateHealthOverlay();
});

// This hook is required for Tokens linked to an Actor
Hooks.on("updateActor", (entity, updated) => {
  if (entity.owner) entity.getActiveTokens(true).map(x => x._updateHealthOverlay());
});
