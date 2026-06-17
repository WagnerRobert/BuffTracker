const STORAGE_KEY = 'buffTrackerState';

const state = {
  buffs: [],
  inputs: {},
  selectedTab: 'summary',
  currentAttacks: [],
  currentNormalFormula: null,
  currentCritFormula: null,
  currentCritRange: 20,
};

const elements = {
  bab: document.getElementById('bab'),
  attr: document.getElementById('attr'),
  buffName: document.getElementById('buff-name'),
  buffAttackBonus: document.getElementById('buff-attack-bonus'),
  buffAttackType: document.getElementById('buff-attack-type'),
  buffDamageBonus: document.getElementById('buff-damage-bonus'),
  buffDamageType: document.getElementById('buff-damage-type'),
  buffDiceCount: document.getElementById('buff-dice-count'),
  buffDiceType: document.getElementById('buff-dice-type'),
  buffPrecision: document.getElementById('buff-precision'),
  buffTemporary: document.getElementById('buff-temporary'),
  temporaryBuffsList: document.getElementById('temporary-buffs-list'),
  addBuff: document.getElementById('add-buff'),
  buffTableBody: document.querySelector('#buff-table tbody'),
  damageMod: document.getElementById('damage-mod'),
  damageDiceCount: document.getElementById('damage-dice-count'),
  damageDiceType: document.getElementById('damage-dice-type'),
  critMultiplier: document.getElementById('crit-multiplier'),
  critRange: document.getElementById('crit-range'),
  formulaText: document.getElementById('formula-text'),
  attackCount: document.getElementById('attack-count'),
  attackList: document.getElementById('attack-list'),
  precisionBonus: document.getElementById('precision-bonus'),
  normalDamage: document.getElementById('normal-damage'),
  critDamage: document.getElementById('crit-damage'),
  damageFormula: document.getElementById('damage-formula'),
  attackString: document.getElementById('attack-string'),
  topNormalDamage: document.getElementById('top-normal-damage'),
  topCritDamage: document.getElementById('top-crit-damage'),
  rollOutput: document.getElementById('roll-output'),
  rollOutputTitle: document.getElementById('roll-output-title'),
  rollOutputBody: document.getElementById('roll-output-body'),
  acBase: document.getElementById('ac-base'),
  acArmor: document.getElementById('ac-armor'),
  acArmorEnh: document.getElementById('ac-armor-enh'),
  acShield: document.getElementById('ac-shield'),
  acShieldEnh: document.getElementById('ac-shield-enh'),
  buffAcBonus: document.getElementById('buff-ac-bonus'),
  buffAcType: document.getElementById('buff-ac-type'),
  buffAcTouch: document.getElementById('buff-ac-touch'),
  buffAcFlatfooted: document.getElementById('buff-ac-flatfooted'),
  acFormula: document.getElementById('ac-formula'),
  acTouchFormula: document.getElementById('ac-touch-formula'),
  acFlatfootedFormula: document.getElementById('ac-flatfooted-formula'),
  acFlatfootedTouchFormula: document.getElementById('ac-flatfooted-touch-formula'),
  summaryAcTotal: document.getElementById('summary-ac-total'),
  summaryAcTouch: document.getElementById('summary-ac-touch'),
  summaryAcFlatfooted: document.getElementById('summary-ac-flatfooted'),
  summaryAcFlatfootedTouch: document.getElementById('summary-ac-flatfooted-touch'),
};

function loadState() {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return;

  try {
    const saved = JSON.parse(storedValue);
    state.buffs = Array.isArray(saved.buffs)
      ? saved.buffs.map((buff) => normalizeBuff(buff))
      : [];
    state.inputs = saved.inputs || {};
    if (saved.selectedTab) {
      state.selectedTab = saved.selectedTab;
    }
  } catch (error) {
    console.warn('Unable to load saved buffs:', error);
  }

  if (state.inputs.bab !== undefined) elements.bab.value = state.inputs.bab;
  if (state.inputs.attr !== undefined) elements.attr.value = state.inputs.attr;
  if (state.inputs.damageMod !== undefined) elements.damageMod.value = state.inputs.damageMod;
  if (state.inputs.damageDiceCount !== undefined) elements.damageDiceCount.value = state.inputs.damageDiceCount;
  if (state.inputs.damageDiceType !== undefined) elements.damageDiceType.value = state.inputs.damageDiceType;
  if (state.inputs.critMultiplier !== undefined) elements.critMultiplier.value = state.inputs.critMultiplier;
  if (state.inputs.critRange !== undefined) elements.critRange.value = state.inputs.critRange;
  if (state.inputs.acBase !== undefined) elements.acBase.value = state.inputs.acBase;
  if (state.inputs.acArmor !== undefined) elements.acArmor.value = state.inputs.acArmor;
  if (state.inputs.acArmorEnh !== undefined) elements.acArmorEnh.value = state.inputs.acArmorEnh;
  if (state.inputs.acShield !== undefined) elements.acShield.value = state.inputs.acShield;
  if (state.inputs.acShieldEnh !== undefined) elements.acShieldEnh.value = state.inputs.acShieldEnh;
}

function saveState() {
  const inputs = {
    bab: elements.bab.value,
    attr: elements.attr.value,
    damageMod: elements.damageMod.value,
    damageDiceCount: elements.damageDiceCount.value,
    damageDiceType: elements.damageDiceType.value,
    critMultiplier: elements.critMultiplier.value,
    critRange: elements.critRange.value,
    acBase: elements.acBase.value,
    acArmor: elements.acArmor.value,
    acArmorEnh: elements.acArmorEnh.value,
    acShield: elements.acShield.value,
    acShieldEnh: elements.acShieldEnh.value,
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      buffs: state.buffs,
      inputs,
      selectedTab: state.selectedTab,
    }),
  );
}

function normalizeBuff(buff) {
  const normalized = {
    name: buff.name || 'Unnamed',
    enabled: buff.enabled !== false,
    temporary: Boolean(buff.temporary),
    effects: [],
  };

  if (Array.isArray(buff.effects)) {
    normalized.effects = buff.effects.map((effect) => ({
      target: effect.target || 'other',
      bonus: Number(effect.bonus) || 0,
      type: (effect.type || '').trim(),
      untyped: Boolean(effect.untyped),
      diceCount: Number(effect.diceCount) || 0,
      diceType: Number(effect.diceType) || 6,
      precision: Boolean(effect.precision),
      touch: Boolean(effect.touch),
      flatfooted: Boolean(effect.flatfooted),
    }));
    return normalized;
  }

const attackType = (buff.attackType || '').trim();
    const damageType = (buff.damageType || '').trim();
    normalized.effects = [
    {
      target: 'attack',
      bonus: Number(buff.attackBonus) || 0,
      type: attackType,
      untyped: attackType === '' || Boolean(buff.attackUntyped),
      diceCount: 0,
      diceType: 6,
      precision: false,
    },
    {
      target: 'damage',
      bonus: Number(buff.damageBonus) || 0,
      type: damageType,
      untyped: damageType === '' || Boolean(buff.damageUntyped),
      diceCount: Number(buff.diceCount) || 0,
      diceType: Number(buff.diceType) || 6,
      precision: Boolean(buff.precision),
    },
    {
      target: 'ac',
      bonus: Number(buff.acBonus) || 0,
      type: (buff.acType || '').trim(),
      untyped: (buff.acType || '').trim() === '',
      diceCount: 0,
      diceType: 6,
      precision: false,
      touch: Boolean(buff.acTouch),
      flatfooted: Boolean(buff.acFlatfooted),
    },
  ];

  return normalized;
}

function update() {
  const bab = Number(elements.bab.value) || 0;
  const attr = Number(elements.attr.value) || 0;
  const damageMod = Number(elements.damageMod.value) || 0;
  const diceCount = Number(elements.damageDiceCount.value) || 1;
  const diceType = Number(elements.damageDiceType.value) || 6;
  const critMultiplier = Number(elements.critMultiplier.value) || 2;
  const critRange = Number(elements.critRange.value) || 20;
  state.currentCritRange = critRange;

  const attackApplied = calculateAttackAppliedBuffs(state.buffs);
  const totalAttackBonus = attr + attackApplied.totalBuff;

  // Build formula chips: BAB, Attr Modifier, then each typed buff component
  const formulaTerms = [
    {value: bab, label: 'BAB', type: null},
    {value: attr, label: 'Attr Modifier', type: null},
    ...attackApplied.appliedComponents
      .filter((c) => c.type !== 'untyped')
      .map((c) => ({value: c.bonus, label: c.name, type: c.type})),
  ];
  elements.formulaText.innerHTML = '';
  formulaTerms.forEach((term, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'formula-sep';
      sep.textContent = term.value >= 0 ? '+' : '−';
      elements.formulaText.appendChild(sep);
    }
    const chip = document.createElement('div');
    chip.className = 'formula-chip';
    const val = document.createElement('strong');
    val.textContent = Math.abs(term.value);
    chip.appendChild(val);
    const src = document.createElement('span');
    src.textContent = term.label;
    chip.appendChild(src);
    if (term.type) {
      const typeLine = document.createElement('span');
      typeLine.className = 'formula-chip-type';
      typeLine.textContent = term.type;
      chip.appendChild(typeLine);
    }
    elements.formulaText.appendChild(chip);
  });

  const attacks = calculateAttackSequence(bab, totalAttackBonus);
  const attackString = attacks
    .map((attack) => `${attack.value >= 0 ? '+' : ''}${attack.value}`)
    .join('/');

  elements.attackString.innerHTML = '';
  attacks.forEach((attack, index) => {
    if (index > 0) {
      elements.attackString.appendChild(document.createTextNode('/'));
    }
    const span = document.createElement('span');
    span.className = 'rollable attack-roll-span';
    span.title = `Click to roll ${attack.label}`;
    span.textContent = `${attack.value >= 0 ? '+' : ''}${attack.value}`;
    span.addEventListener('click', () => rollAttack(attack));
    elements.attackString.appendChild(span);
  });
  elements.attackCount.textContent = `${attacks.length}`;
  state.currentAttacks = attacks;
  renderAttackList(attacks);

  const damageApplied = calculateDamageAppliedBuffs(state.buffs);
  const acBase = Number(elements.acBase.value) || 10;
  const armorBonus = Number(elements.acArmor.value) || 0;
  const armorEnhBonus = Number(elements.acArmorEnh.value) || 0;
  const shieldBonus = Number(elements.acShield.value) || 0;
  const shieldEnhBonus = Number(elements.acShieldEnh.value) || 0;

  const acBaseEffects = [
    {type: 'armor', bonus: armorBonus, untyped: false, touch: false, flatfooted: true, name: 'Armor'},
    {type: 'enhancement (armor)', bonus: armorEnhBonus, untyped: false, touch: false, flatfooted: true, name: 'Enh. (Armor)'},
    {type: 'shield', bonus: shieldBonus, untyped: false, touch: false, flatfooted: true, name: 'Shield'},
    {type: 'enhancement (shield)', bonus: shieldEnhBonus, untyped: false, touch: false, flatfooted: true, name: 'Enh. (Shield)'},
  ].filter((e) => e.bonus !== 0);

  const acApplied = calculateACAppliedBuffs(state.buffs, acBaseEffects);
  renderBuffTable(state.buffs, attackApplied.appliedBuffsByType, damageApplied.appliedBuffsByType, acApplied.appliedBuffsByType);
  renderTemporaryBuffs(state.buffs);
  const normalDamageBonus = damageMod + damageApplied.totalBuff;
  const multipliedBonus = damageMod + damageApplied.nonPrecisionTotal;
  const critDiceCount = diceCount * critMultiplier;
  const critBonus = multipliedBonus * critMultiplier;
  const totalCritBonus = critBonus + damageApplied.precisionTotal;
  const baseDice = {[`d${diceType}`]: diceCount};
  const critDice = {[`d${diceType}`]: critDiceCount};
  const normalDiceExpression = buildDiceExpression(mergeDiceCounts(baseDice, damageApplied.bonusDice));
  const critDiceExpression = buildDiceExpression(mergeDiceCounts(critDice, damageApplied.bonusDice));
  const normalFormula = `${normalDiceExpression} + ${normalDamageBonus}`;
  const critFormula = `${critDiceExpression} + ${totalCritBonus}`;

  elements.precisionBonus.textContent = `${damageApplied.precisionTotal}`;
  elements.normalDamage.textContent = normalFormula;
  elements.critDamage.textContent = critFormula;
  elements.topNormalDamage.textContent = normalFormula;
  elements.topCritDamage.textContent = critFormula;
  state.currentNormalFormula = {diceExpression: normalDiceExpression, bonus: normalDamageBonus, bonusDice: damageApplied.bonusDice, diceCount, diceType};
  state.currentCritFormula = {diceExpression: critDiceExpression, bonus: totalCritBonus, bonusDice: damageApplied.bonusDice, diceCount: critDiceCount, diceType};

  // Build damage formula chips: dice, Attr Modifier, then each buff component
  const damageFormulaTerms = [
    {value: null, label: normalDiceExpression, type: null, isDice: true},
    {value: damageMod, label: 'Attr Modifier', type: null},
    ...damageApplied.appliedComponents
      .filter((c) => c.type !== 'untyped' && c.bonus !== 0)
      .map((c) => ({value: c.bonus, label: c.name, type: c.type + (c.precision ? ' (prec.)' : '')})),
  ];
  elements.damageFormula.innerHTML = '';
  damageFormulaTerms.forEach((term, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'formula-sep';
      sep.textContent = (term.value !== null && term.value < 0) ? '−' : '+';
      elements.damageFormula.appendChild(sep);
    }
    const chip = document.createElement('div');
    chip.className = 'formula-chip';
    const val = document.createElement('strong');
    val.textContent = term.isDice ? term.label : Math.abs(term.value);
    chip.appendChild(val);
    const src = document.createElement('span');
    src.textContent = term.label === normalDiceExpression ? 'Damage Dice' : term.label;
    chip.appendChild(src);
    if (term.type) {
      const typeLine = document.createElement('span');
      typeLine.className = 'formula-chip-type';
      typeLine.textContent = term.type;
      chip.appendChild(typeLine);
    }
    elements.damageFormula.appendChild(chip);
  });

  const totalAC = acBase + acApplied.totalBuff;
  const touchAC = acBase + acApplied.touchBuff;
  const flatfootedAC = acBase + acApplied.flatfootedBuff;
  const flatfootedTouchAC = acBase + acApplied.flatfootedTouchBuff;
  renderACFormulaChips(elements.acFormula, acBase, acApplied.fullComponents);
  renderACFormulaChips(elements.acTouchFormula, acBase, acApplied.touchComponents);
  renderACFormulaChips(elements.acFlatfootedFormula, acBase, acApplied.flatfootedComponents);
  renderACFormulaChips(elements.acFlatfootedTouchFormula, acBase, acApplied.flatfootedTouchComponents);
  elements.summaryAcTotal.textContent = `${totalAC}`;
  elements.summaryAcTouch.textContent = `${touchAC}`;
  elements.summaryAcFlatfooted.textContent = `${flatfootedAC}`;
  elements.summaryAcFlatfootedTouch.textContent = `${flatfootedTouchAC}`;

  saveState();
}

function calculateAttackAppliedBuffs(buffs) {
  const typed = {};
  const untypedItems = [];

  buffs
    .filter((buff) => buff.enabled)
    .forEach((buff) => {
      buff.effects
        .filter((effect) => effect.target === 'attack')
        .forEach((effect) => {
          const bonus = Number(effect.bonus) || 0;
          if (bonus === 0) return;
          if (effect.untyped) {
            untypedItems.push({bonus, name: buff.name, type: 'untyped'});
            return;
          }
          const type = effect.type.trim().toLowerCase() || 'other';
          if (!typed[type] || bonus > typed[type].bonus) {
            typed[type] = {bonus, name: buff.name, type};
          }
        });
    });

  const appliedTyped = Object.values(typed);
  const appliedComponents = [...appliedTyped, ...untypedItems];
  const appliedBuffsByType = appliedTyped.map(({type, bonus}) => ({type, bonus}));
  const totalBuff = appliedComponents.reduce((sum, c) => sum + c.bonus, 0);
  const untypedTotal = untypedItems.reduce((sum, c) => sum + c.bonus, 0);

  return {totalBuff, appliedBuffsByType, appliedComponents, untypedTotal};
}

function calculateDamageAppliedBuffs(buffs) {
  const typed = {};
  const untyped = [];

  buffs
    .filter((buff) => buff.enabled)
    .forEach((buff) => {
      buff.effects
        .filter((effect) => effect.target === 'damage')
        .forEach((effect) => {
          const bonus = Number(effect.bonus) || 0;
          const diceCount = Number(effect.diceCount) || 0;
          const effectHasValue = bonus !== 0 || diceCount > 0;

          if (!effectHasValue && !effect.untyped) return;

          if (effect.untyped) {
            untyped.push({...effect, buffName: buff.name});
            return;
          }

          const type = effect.type.trim().toLowerCase() || 'other';
          const current = typed[type];
          if (!current || bonus > Number(current.bonus)) {
            typed[type] = {...effect, buffName: buff.name};
          }
        });
    });

  const typedApplied = Object.values(typed);
  const appliedBuffs = [...typedApplied, ...untyped];
  const totalBuff = appliedBuffs.reduce((sum, effect) => sum + (Number(effect.bonus) || 0), 0);
  const precisionTotal = appliedBuffs.reduce((sum, effect) => sum + (effect.precision ? Number(effect.bonus) || 0 : 0), 0);
  const nonPrecisionTotal = totalBuff - precisionTotal;
  const bonusDice = appliedBuffs.reduce((result, effect) => {
    const count = Number(effect.diceCount) || 0;
    if (count > 0) {
      const key = `d${effect.diceType}`;
      result[key] = (result[key] || 0) + count;
    }
    return result;
  }, {});
  const appliedBuffsByType = typedApplied.map((effect) => ({type: effect.type.trim().toLowerCase() || 'other', bonus: Number(effect.bonus) || 0}));
  const appliedComponents = [
    ...typedApplied.map((e) => ({bonus: Number(e.bonus) || 0, name: e.buffName || '', type: e.type.trim().toLowerCase() || 'other', precision: e.precision})),
    ...untyped.map((e) => ({bonus: Number(e.bonus) || 0, name: e.buffName || '', type: 'untyped', precision: e.precision})),
  ];

  return {
    totalBuff,
    precisionTotal,
    nonPrecisionTotal,
    bonusDice,
    appliedBuffsByType,
    appliedComponents,
  };
}

function calculateACAppliedBuffs(buffs, baseEffects) {
  function sumEffects(effects) {
    const typed = {};
    const stackingItems = [];

    effects.forEach((effect) => {
      const bonus = Number(effect.bonus) || 0;
      if (bonus === 0) return;
      const type = (effect.type || '').trim().toLowerCase();

      if (effect.untyped || type === 'dodge') {
        stackingItems.push({bonus, name: effect.name || '', type: effect.untyped ? 'untyped' : 'dodge'});
        return;
      }

      const typeKey = type || 'other';
      if (!typed[typeKey] || bonus > typed[typeKey].bonus) {
        typed[typeKey] = {bonus, name: effect.name || '', type: typeKey};
      }
    });

    const typedItems = Object.values(typed);
    const components = [...typedItems, ...stackingItems];
    const totalBuff = components.reduce((sum, c) => sum + c.bonus, 0);
    const appliedBuffsByType = typedItems.map(({type, bonus}) => ({type, bonus}));
    return {totalBuff, appliedBuffsByType, components};
  }

  const allEffects = [
    ...buffs
      .filter((buff) => buff.enabled)
      .flatMap((buff) => buff.effects.filter((effect) => effect.target === 'ac').map((e) => ({...e, name: buff.name}))),
    ...(baseEffects || []),
  ];

  const full = sumEffects(allEffects);

  const touchEffects = allEffects.filter((e) => {
    const type = (e.type || '').trim().toLowerCase();
    return e.touch || e.untyped || type === 'dodge';
  });
  const touch = sumEffects(touchEffects);

  const ffEffects = allEffects.filter((e) => {
    const type = (e.type || '').trim().toLowerCase();
    return e.flatfooted && type !== 'dodge';
  });
  const flatfooted = sumEffects(ffEffects);

  const ffTouchEffects = allEffects.filter((e) => {
    const type = (e.type || '').trim().toLowerCase();
    return e.touch && e.flatfooted && type !== 'dodge';
  });
  const flatfootedTouch = sumEffects(ffTouchEffects);

  return {
    totalBuff: full.totalBuff,
    appliedBuffsByType: full.appliedBuffsByType,
    touchBuff: touch.totalBuff,
    flatfootedBuff: flatfooted.totalBuff,
    flatfootedTouchBuff: flatfootedTouch.totalBuff,
    fullComponents: full.components,
    touchComponents: touch.components,
    flatfootedComponents: flatfooted.components,
    flatfootedTouchComponents: flatfootedTouch.components,
  };
}

function renderACFormulaChips(container, acBase, components) {
  container.innerHTML = '';
  const terms = [
    {value: acBase, label: 'Base AC', type: null},
    ...(components || []).filter((c) => c.bonus !== 0).map((c) => ({
      value: c.bonus,
      label: c.name || c.type,
      type: c.type !== 'untyped' ? c.type : null,
    })),
  ];
  terms.forEach((term, index) => {
    if (index > 0) {
      const sep = document.createElement('span');
      sep.className = 'formula-sep';
      sep.textContent = term.value >= 0 ? '+' : '\u2212';
      container.appendChild(sep);
    }
    const chip = document.createElement('div');
    chip.className = 'formula-chip';
    const val = document.createElement('strong');
    val.textContent = Math.abs(term.value);
    chip.appendChild(val);
    const src = document.createElement('span');
    src.textContent = term.label;
    chip.appendChild(src);
    if (term.type) {
      const typeLine = document.createElement('span');
      typeLine.className = 'formula-chip-type';
      typeLine.textContent = term.type;
      chip.appendChild(typeLine);
    }
    container.appendChild(chip);
  });
}

function buildDiceExpression(bonusDice) {
  return Object.entries(bonusDice)
    .map(([dieType, count]) => `${count}${dieType}`)
    .join(' + ');
}

function mergeDiceCounts(...diceObjects) {
  return diceObjects.reduce((result, dice) => {
    Object.entries(dice).forEach(([dieType, count]) => {
      result[dieType] = (result[dieType] || 0) + count;
    });
    return result;
  }, {});
}

function calculateAttackSequence(bab, totalBonus) {
  const thresholds = [16, 11, 6];
  let count = 1;

  thresholds.forEach((threshold) => {
    if (bab >= threshold) count += 1;
  });

  count = Math.min(count, 4);
  const attacks = [];

  for (let index = 0; index < count; index += 1) {
    const penalty = 5 * index;
    const attackValue = bab + totalBonus - penalty;
    attacks.push({label: index === 0 ? 'Primary Attack' : `Secondary Attack ${index}`, value: attackValue});
  }

  return attacks;
}

function renderAttackList(attacks) {
  elements.attackList.innerHTML = '';
  attacks.forEach((attack) => {
    const item = document.createElement('div');
    item.className = 'attack-item';
    item.innerHTML = `<span>${attack.label}</span><strong>${attack.value >= 0 ? '+' : ''}${attack.value}</strong>`;
    elements.attackList.appendChild(item);
  });
}

function buildEffectSummary(buff) {
  return buff.effects
    .map((effect) => {
      const type = effect.untyped ? 'untyped' : effect.type || 'Other';
      const sign = effect.bonus >= 0 ? '+' : '';

      if (effect.target === 'attack') {
        return `${sign}${effect.bonus} ${type} attack`;
      }

      if (effect.target === 'damage') {
        const diceString = effect.diceCount > 0 ? ` + ${effect.diceCount}d${effect.diceType}` : '';
        const precisionString = effect.precision ? ' precision' : '';
        return `${sign}${effect.bonus}${diceString} ${type} damage${precisionString}`;
      }

      if (effect.target === 'ac') {
        return `${sign}${effect.bonus} ${type} AC`;
      }

      return `${sign}${effect.bonus} ${type} ${effect.target}${effect.untyped ? ' (untyped)' : ''}`;
    })
    .join(' | ');
}

function renderTemporaryBuffs(buffs) {
  const temporaryBuffs = buffs.filter((buff) => buff.temporary);
  elements.temporaryBuffsList.innerHTML = '';

  if (temporaryBuffs.length === 0) {
    elements.temporaryBuffsList.innerHTML = '<p>No temporary buffs added.</p>';
    return;
  }

  temporaryBuffs.forEach((buff, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'temporary-buff-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = buff.enabled;
    checkbox.addEventListener('change', () => {
      buff.enabled = checkbox.checked;
      update();
    });

    const label = document.createElement('label');
    label.textContent = buff.name || 'Unnamed temporary buff';
    label.prepend(checkbox);

    wrapper.appendChild(label);
    elements.temporaryBuffsList.appendChild(wrapper);
  });
}

function renderBuffTable(buffs, attackAppliedByType, damageAppliedByType, acAppliedByType) {
  elements.buffTableBody.innerHTML = '';
  buffs.forEach((buff, index) => {
    const row = document.createElement('tr');
    if (!buff.enabled) row.classList.add('disabled-row');

    const effectSummary = buildEffectSummary(buff);
    const anyApplied = buff.effects.some((effect) => {
      if (effect.target === 'attack') {
        const normalized = effect.type.trim().toLowerCase() || 'other';
        return (
          Number(effect.bonus) !== 0 &&
          (effect.untyped || attackAppliedByType.some((item) => item.type === normalized && Number(effect.bonus) === item.bonus))
        );
      }

      if (effect.target === 'damage') {
        const normalized = effect.type.trim().toLowerCase() || 'other';
        const hasDamage = Number(effect.bonus) !== 0 || effect.diceCount > 0;
        return (
          hasDamage &&
          (effect.untyped || damageAppliedByType.some((item) => item.type === normalized && Number(effect.bonus) === item.bonus))
        );
      }

      if (effect.target === 'ac') {
        const normalized = (effect.type || '').trim().toLowerCase() || 'other';
        return (
          Number(effect.bonus) !== 0 &&
          (effect.untyped || normalized === 'dodge' || (acAppliedByType || []).some((item) => item.type === normalized && Number(effect.bonus) === item.bonus))
        );
      }

      return false;
    });

    if (!buff.enabled || !anyApplied) {
      row.classList.add('not-applied-row');
    }

    row.innerHTML = `
      <td><input type="checkbox" class="buff-active" data-index="${index}" ${buff.enabled ? 'checked' : ''} /></td>
      <td>${buff.name || 'Unnamed'}</td>
      <td>${effectSummary || 'No effects'}</td>
      <td>${anyApplied ? 'Yes' : 'No'}</td>
      <td>${buff.temporary ? 'Yes' : 'No'}</td>
      <td><button type="button" data-index="${index}">Remove</button></td>
    `;

    elements.buffTableBody.appendChild(row);
  });

  elements.buffTableBody.querySelectorAll('.buff-active').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const index = Number(checkbox.dataset.index);
      state.buffs[index].enabled = checkbox.checked;
      update();
    });
  });

  elements.buffTableBody.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      state.buffs.splice(index, 1);
      update();
    });
  });
}

function addBuff() {
  const name = elements.buffName.value.trim();
  const attackBonus = Number(elements.buffAttackBonus.value) || 0;
  const attackType = elements.buffAttackType.value.trim();
  const damageBonus = Number(elements.buffDamageBonus.value) || 0;
  const damageType = elements.buffDamageType.value.trim();
  const diceCount = Number(elements.buffDiceCount.value) || 0;
  const diceType = Number(elements.buffDiceType.value) || 6;
  const precision = elements.buffPrecision.checked;
  const acBonus = Number(elements.buffAcBonus.value) || 0;
  const acType = elements.buffAcType.value.trim();
  const acTouch = elements.buffAcTouch.checked;
  const acFlatfooted = elements.buffAcFlatfooted.checked;

  if (!name) {
    alert('Please enter a buff name.');
    return;
  }

  state.buffs.push({
    name,
    enabled: true,
    temporary: elements.buffTemporary.checked,
    effects: [
      {
        target: 'attack',
        bonus: attackBonus,
        type: attackType,
        untyped: attackType === '',
        diceCount: 0,
        diceType: 6,
        precision: false,
      },
      {
        target: 'damage',
        bonus: damageBonus,
        type: damageType,
        untyped: damageType === '',
        diceCount,
        diceType,
        precision,
      },
      {
        target: 'ac',
        bonus: acBonus,
        type: acType,
        untyped: acType === '',
        diceCount: 0,
        diceType: 6,
        precision: false,
        touch: acTouch,
        flatfooted: acFlatfooted,
      },
    ],
  });

  elements.buffName.value = '';
  elements.buffAttackBonus.value = '0';
  elements.buffAttackType.value = '';
  elements.buffDamageBonus.value = '0';
  elements.buffDamageType.value = '';
  elements.buffDiceCount.value = '0';
  elements.buffDiceType.value = '6';
  elements.buffPrecision.checked = false;
  elements.buffTemporary.checked = false;
  elements.buffAcBonus.value = '0';
  elements.buffAcType.value = '';
  elements.buffAcTouch.checked = false;
  elements.buffAcFlatfooted.checked = false;
  update();
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDiceExpression(diceCount, diceType, bonusDice) {
  const rolls = [];
  for (let i = 0; i < diceCount; i += 1) {
    rolls.push({die: `d${diceType}`, result: rollDie(diceType)});
  }
  Object.entries(bonusDice || {}).forEach(([dieName, count]) => {
    const sides = Number(dieName.replace('d', ''));
    for (let i = 0; i < count; i += 1) {
      rolls.push({die: dieName, result: rollDie(sides)});
    }
  });
  return rolls;
}

function showRoll(title, bodyHtml) {
  elements.rollOutputTitle.textContent = title;
  elements.rollOutputBody.innerHTML = bodyHtml;
  elements.rollOutput.hidden = false;
}

function rollAttack(attack) {
  const d20 = rollDie(20);
  const total = d20 + attack.value;
  const critRange = state.currentCritRange;
  const isThreat = d20 >= critRange;
  const sign = attack.value >= 0 ? '+' : '';
  const threatNote = isThreat ? `<span class="roll-crit-threat"> — Crit Threat!</span>` : '';
  showRoll(
    attack.label,
    `<span class="roll-d20">d20: ${d20}</span> ${sign}<span class="roll-bonus">${attack.value}</span> = <span class="roll-total">${total}</span>${threatNote}`,
  );
}

function rollDamage(label, formula) {
  const rolls = rollDiceExpression(formula.diceCount, formula.diceType, formula.bonusDice);
  const diceTotal = rolls.reduce((s, r) => s + r.result, 0);
  const total = diceTotal + formula.bonus;
  const diceBreakdown = rolls.map((r) => `${r.die}: ${r.result}`).join(', ');
  showRoll(
    label,
    `<span class="roll-dice">[${diceBreakdown}]</span> + <span class="roll-bonus">${formula.bonus}</span> = <span class="roll-total">${total}</span>`,
  );
}

function addInputListeners() {
  ['bab', 'attr', 'damage-mod', 'damage-dice-count', 'damage-dice-type', 'crit-multiplier', 'crit-range', 'ac-base', 'ac-armor', 'ac-armor-enh', 'ac-shield', 'ac-shield-enh'].forEach((id) => {
    document.getElementById(id).addEventListener('input', update);
  });
}

function setActiveTab(tabName) {
  state.selectedTab = tabName;
  saveState();

  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.id !== `${tabName}-tab`);
  });
}

function init() {
  loadState();
  addInputListeners();
  elements.addBuff.addEventListener('click', addBuff);
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => setActiveTab(button.dataset.tab));
  });

  // Summary clickable rolls
  elements.attackString.classList.add('attack-string-container');

  elements.topNormalDamage.classList.add('rollable');
  elements.topNormalDamage.title = 'Click to roll normal damage';
  elements.topNormalDamage.addEventListener('click', () => {
    if (state.currentNormalFormula) rollDamage('Normal Damage', state.currentNormalFormula);
  });

  elements.topCritDamage.classList.add('rollable');
  elements.topCritDamage.title = 'Click to roll critical damage';
  elements.topCritDamage.addEventListener('click', () => {
    if (state.currentCritFormula) rollDamage('Critical Damage', state.currentCritFormula);
  });

  setActiveTab(state.selectedTab);
  update();
}

init();
