const STORAGE_KEY = 'buffTrackerState';

const state = {
  buffs: [],
  inputs: {},
  selectedTab: 'summary',
  currentAttacks: [],
  currentNormalFormula: null,
  currentCritFormula: null,
  currentCritRange: 20,
  currentSaves: {fort: 0, reflex: 0, will: 0},
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
  acArmor: document.getElementById('ac-armor'),
  acArmorEnh: document.getElementById('ac-armor-enh'),
  acShield: document.getElementById('ac-shield'),
  acShieldEnh: document.getElementById('ac-shield-enh'),
  acDeflection: document.getElementById('ac-deflection'),
  acNatural: document.getElementById('ac-natural'),
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
  summaryFort: document.getElementById('summary-fort'),
  summaryReflex: document.getElementById('summary-reflex'),
  summaryWill: document.getElementById('summary-will'),
  saveFortBase: document.getElementById('save-fort-base'),
  saveFortMod: document.getElementById('save-fort-mod'),
  saveReflexBase: document.getElementById('save-reflex-base'),
  saveReflexMod: document.getElementById('save-reflex-mod'),
  saveWillBase: document.getElementById('save-will-base'),
  saveWillMod: document.getElementById('save-will-mod'),
  saveAllBonus: document.getElementById('save-all-bonus'),
  saveFortFormula: document.getElementById('save-fort-formula'),
  saveReflexFormula: document.getElementById('save-reflex-formula'),
  saveWillFormula: document.getElementById('save-will-formula'),
  buffFortBonus: document.getElementById('buff-fort-bonus'),
  buffFortType: document.getElementById('buff-fort-type'),
  buffReflexBonus: document.getElementById('buff-reflex-bonus'),
  buffReflexType: document.getElementById('buff-reflex-type'),
  buffWillBonus: document.getElementById('buff-will-bonus'),
  buffWillType: document.getElementById('buff-will-type'),
  buffAllsavesBonus: document.getElementById('buff-allsaves-bonus'),
  buffAllsavesType: document.getElementById('buff-allsaves-type'),
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
  if (state.inputs.acArmor !== undefined) elements.acArmor.value = state.inputs.acArmor;
  if (state.inputs.acArmorEnh !== undefined) elements.acArmorEnh.value = state.inputs.acArmorEnh;
  if (state.inputs.acShield !== undefined) elements.acShield.value = state.inputs.acShield;
  if (state.inputs.acShieldEnh !== undefined) elements.acShieldEnh.value = state.inputs.acShieldEnh;
  if (state.inputs.acDeflection !== undefined) elements.acDeflection.value = state.inputs.acDeflection;
  if (state.inputs.acNatural !== undefined) elements.acNatural.value = state.inputs.acNatural;
  if (state.inputs.saveFortBase !== undefined) elements.saveFortBase.value = state.inputs.saveFortBase;
  if (state.inputs.saveFortMod !== undefined) elements.saveFortMod.value = state.inputs.saveFortMod;
  if (state.inputs.saveReflexBase !== undefined) elements.saveReflexBase.value = state.inputs.saveReflexBase;
  if (state.inputs.saveReflexMod !== undefined) elements.saveReflexMod.value = state.inputs.saveReflexMod;
  if (state.inputs.saveWillBase !== undefined) elements.saveWillBase.value = state.inputs.saveWillBase;
  if (state.inputs.saveWillMod !== undefined) elements.saveWillMod.value = state.inputs.saveWillMod;
  if (state.inputs.saveAllBonus !== undefined) elements.saveAllBonus.value = state.inputs.saveAllBonus;
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
    acArmor: elements.acArmor.value,
    acArmorEnh: elements.acArmorEnh.value,
    acShield: elements.acShield.value,
    acShieldEnh: elements.acShieldEnh.value,
    acDeflection: elements.acDeflection.value,
    acNatural: elements.acNatural.value,
    saveFortBase: elements.saveFortBase.value,
    saveFortMod: elements.saveFortMod.value,
    saveReflexBase: elements.saveReflexBase.value,
    saveReflexMod: elements.saveReflexMod.value,
    saveWillBase: elements.saveWillBase.value,
    saveWillMod: elements.saveWillMod.value,
    saveAllBonus: elements.saveAllBonus.value,
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
      saveTarget: effect.saveTarget || null,
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
      .map((c) => ({value: c.bonus, label: c.name, type: c.type !== 'untyped' ? c.type : null})),
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
  const acBase = 10;
  const armorBonus = Number(elements.acArmor.value) || 0;
  const armorEnhBonus = Number(elements.acArmorEnh.value) || 0;
  const shieldBonus = Number(elements.acShield.value) || 0;
  const shieldEnhBonus = Number(elements.acShieldEnh.value) || 0;
  const deflectionBonus = Number(elements.acDeflection.value) || 0;
  const naturalBonus = Number(elements.acNatural.value) || 0;

  const acBaseEffects = [
    {type: 'armor', bonus: armorBonus, untyped: false, touch: false, flatfooted: true, name: 'Armor'},
    {type: 'enhancement (armor)', bonus: armorEnhBonus, untyped: false, touch: false, flatfooted: true, name: 'Enh. (Armor)'},
    {type: 'shield', bonus: shieldBonus, untyped: false, touch: false, flatfooted: true, name: 'Shield'},
    {type: 'enhancement (shield)', bonus: shieldEnhBonus, untyped: false, touch: false, flatfooted: true, name: 'Enh. (Shield)'},
    {type: 'deflection', bonus: deflectionBonus, untyped: false, touch: true, flatfooted: true, name: 'Deflection'},
    {type: 'natural armor', bonus: naturalBonus, untyped: false, touch: false, flatfooted: true, name: 'Natural Armor'},
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
      .filter((c) => c.bonus !== 0)
      .map((c) => ({value: c.bonus, label: c.name, type: c.type === 'untyped' ? (c.precision ? '(prec.)' : null) : c.type + (c.precision ? ' (prec.)' : '')})),
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

  const fortBase = Number(elements.saveFortBase.value) || 0;
  const fortMod = Number(elements.saveFortMod.value) || 0;
  const reflexBase = Number(elements.saveReflexBase.value) || 0;
  const reflexMod = Number(elements.saveReflexMod.value) || 0;
  const willBase = Number(elements.saveWillBase.value) || 0;
  const willMod = Number(elements.saveWillMod.value) || 0;
  const saveAllBonus = Number(elements.saveAllBonus.value) || 0;
  const saveApplied = calculateSaveAppliedBuffs(state.buffs);
  const fortTotal = fortBase + fortMod + saveAllBonus + saveApplied.fort.total;
  const reflexTotal = reflexBase + reflexMod + saveAllBonus + saveApplied.reflex.total;
  const willTotal = willBase + willMod + saveAllBonus + saveApplied.will.total;
  state.currentSaves = {fort: fortTotal, reflex: reflexTotal, will: willTotal};
  const allComponents = saveAllBonus !== 0 ? [{bonus: saveAllBonus, name: 'All Saves', type: null}] : [];
  renderSaveFormulaChips(elements.saveFortFormula, fortBase, fortMod, allComponents, saveApplied.fort.components);
  renderSaveFormulaChips(elements.saveReflexFormula, reflexBase, reflexMod, allComponents, saveApplied.reflex.components);
  renderSaveFormulaChips(elements.saveWillFormula, willBase, willMod, allComponents, saveApplied.will.components);
  elements.summaryFort.textContent = fortTotal >= 0 ? `+${fortTotal}` : `${fortTotal}`;
  elements.summaryReflex.textContent = reflexTotal >= 0 ? `+${reflexTotal}` : `${reflexTotal}`;
  elements.summaryWill.textContent = willTotal >= 0 ? `+${willTotal}` : `${willTotal}`;

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

function calculateSaveAppliedBuffs(buffs) {
  function sumSaveEffects(effects) {
    const typed = {};
    const untypedItems = [];
    effects.forEach((effect) => {
      const bonus = Number(effect.bonus) || 0;
      if (bonus === 0) return;
      if (effect.untyped) {
        untypedItems.push({bonus, name: effect.buffName || '', type: 'untyped'});
        return;
      }
      const type = (effect.type || '').trim().toLowerCase() || 'other';
      if (!typed[type] || bonus > typed[type].bonus) {
        typed[type] = {bonus, name: effect.buffName || '', type};
      }
    });
    const typedItems = Object.values(typed);
    const components = [...typedItems, ...untypedItems];
    return {total: components.reduce((s, c) => s + c.bonus, 0), components};
  }

  const fortEffects = [];
  const reflexEffects = [];
  const willEffects = [];

  buffs.filter((b) => b.enabled).forEach((buff) => {
    buff.effects
      .filter((e) => e.target === 'save' && Number(e.bonus) !== 0)
      .forEach((e) => {
        const entry = {...e, buffName: buff.name};
        if (e.saveTarget === 'fort' || e.saveTarget === 'all') fortEffects.push(entry);
        if (e.saveTarget === 'reflex' || e.saveTarget === 'all') reflexEffects.push(entry);
        if (e.saveTarget === 'will' || e.saveTarget === 'all') willEffects.push(entry);
      });
  });

  return {
    fort: sumSaveEffects(fortEffects),
    reflex: sumSaveEffects(reflexEffects),
    will: sumSaveEffects(willEffects),
  };
}

function renderSaveFormulaChips(container, base, mod, allComponents, buffComponents) {
  container.innerHTML = '';
  const terms = [
    {value: base, label: 'Base Save'},
    {value: mod, label: 'Attr Modifier'},
    ...allComponents.map((c) => ({value: c.bonus, label: c.name, type: c.type})),
    ...buffComponents.map((c) => ({value: c.bonus, label: c.name, type: c.type !== 'untyped' ? c.type : null})),
  ].filter((t) => t.value !== 0 || t.label === 'Base Save' || t.label === 'Attr Modifier');

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

function rollSave(saveKey) {
  const total = state.currentSaves[saveKey];
  const label = {fort: 'Fortitude', reflex: 'Reflex', will: 'Will'}[saveKey];
  const d20 = rollDie(20);
  const result = d20 + total;
  const sign = total >= 0 ? '+' : '';
  let note = '';
  if (d20 === 1) note = `<span class="roll-nat-miss"> \u2014 Nat 1: Auto Fail!</span>`;
  else if (d20 === 20) note = `<span class="roll-nat-hit"> \u2014 Nat 20: Auto Success!</span>`;
  showRoll(
    `${label} Save`,
    `<span class="roll-d20">d20: ${d20}</span> ${sign}<span class="roll-bonus">${total}</span> = <span class="roll-total">${result}</span>${note}`,
  );
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
    .filter((effect) => {
      if (effect.target === 'damage') return Number(effect.bonus) !== 0 || effect.diceCount > 0;
      return Number(effect.bonus) !== 0;
    })
    .map((effect) => {
      const type = effect.untyped ? '' : effect.type || 'Other';
      const sign = effect.bonus >= 0 ? '+' : '';
      const typePrefix = type ? `${type} ` : '';

      if (effect.target === 'attack') {
        return `${sign}${effect.bonus} ${typePrefix}attack`;
      }

      if (effect.target === 'damage') {
        const diceString = effect.diceCount > 0 ? ` + ${effect.diceCount}d${effect.diceType}` : '';
        const precisionString = effect.precision ? ' precision' : '';
        return `${sign}${effect.bonus}${diceString} ${typePrefix}damage${precisionString}`;
      }

      if (effect.target === 'ac') {
        return `${sign}${effect.bonus} ${typePrefix}AC`;
      }

      if (effect.target === 'save') {
        const saveLabel = {fort: 'fort', reflex: 'ref', will: 'will', all: 'allRes'}[effect.saveTarget] || effect.saveTarget;
        return `${sign}${effect.bonus} ${typePrefix}${saveLabel}`;
      }

      return `${sign}${effect.bonus} ${typePrefix}${effect.target}`;
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
      <td>
        <button type="button" class="edit-buff" data-index="${index}">Edit</button>
        <button type="button" class="remove-buff" data-index="${index}">Remove</button>
      </td>
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

  elements.buffTableBody.querySelectorAll('.edit-buff').forEach((button) => {
    button.addEventListener('click', () => {
      editBuff(Number(button.dataset.index));
    });
  });

  elements.buffTableBody.querySelectorAll('.remove-buff').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      state.buffs.splice(index, 1);
      update();
    });
  });
}

function editBuff(index) {
  const buff = state.buffs[index];
  const getEffect = (target) => buff.effects.find((e) => e.target === target) || {};
  const getSaveEffect = (saveTarget) => buff.effects.find((e) => e.target === 'save' && e.saveTarget === saveTarget) || {};
  const attack = getEffect('attack');
  const damage = getEffect('damage');
  const ac = getEffect('ac');
  const fort = getSaveEffect('fort');
  const reflex = getSaveEffect('reflex');
  const will = getSaveEffect('will');
  const allsaves = getSaveEffect('all');
  elements.buffName.value = buff.name;
  elements.buffAttackBonus.value = attack.bonus || 0;
  elements.buffAttackType.value = attack.untyped ? '' : (attack.type || '');
  elements.buffDamageBonus.value = damage.bonus || 0;
  elements.buffDamageType.value = damage.untyped ? '' : (damage.type || '');
  elements.buffDiceCount.value = damage.diceCount || 0;
  elements.buffDiceType.value = damage.diceType || 6;
  elements.buffPrecision.checked = !!damage.precision;
  elements.buffTemporary.checked = !!buff.temporary;
  elements.buffAcBonus.value = ac.bonus || 0;
  elements.buffAcType.value = ac.untyped ? '' : (ac.type || '');
  elements.buffAcTouch.checked = !!ac.touch;
  elements.buffAcFlatfooted.checked = !!ac.flatfooted;
  elements.buffFortBonus.value = fort.bonus || 0;
  elements.buffFortType.value = fort.untyped ? '' : (fort.type || '');
  elements.buffReflexBonus.value = reflex.bonus || 0;
  elements.buffReflexType.value = reflex.untyped ? '' : (reflex.type || '');
  elements.buffWillBonus.value = will.bonus || 0;
  elements.buffWillType.value = will.untyped ? '' : (will.type || '');
  elements.buffAllsavesBonus.value = allsaves.bonus || 0;
  elements.buffAllsavesType.value = allsaves.untyped ? '' : (allsaves.type || '');
  setActiveTab('buffs');
  elements.buffName.focus();
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
  const fortBonus = Number(elements.buffFortBonus.value) || 0;
  const fortType = elements.buffFortType.value.trim();
  const reflexBonus = Number(elements.buffReflexBonus.value) || 0;
  const reflexType = elements.buffReflexType.value.trim();
  const willBonus = Number(elements.buffWillBonus.value) || 0;
  const willType = elements.buffWillType.value.trim();
  const allsavesBonus = Number(elements.buffAllsavesBonus.value) || 0;
  const allsavesType = elements.buffAllsavesType.value.trim();

  if (!name) {
    alert('Please enter a buff name.');
    return;
  }

  const existingIndex = state.buffs.findIndex((b) => b.name === name);
  const newBuff = {
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
      {target: 'save', saveTarget: 'fort', bonus: fortBonus, type: fortType, untyped: fortType === ''},
      {target: 'save', saveTarget: 'reflex', bonus: reflexBonus, type: reflexType, untyped: reflexType === ''},
      {target: 'save', saveTarget: 'will', bonus: willBonus, type: willType, untyped: willType === ''},
      {target: 'save', saveTarget: 'all', bonus: allsavesBonus, type: allsavesType, untyped: allsavesType === ''},
    ],
  };

  if (existingIndex !== -1) {
    newBuff.enabled = state.buffs[existingIndex].enabled;
    state.buffs[existingIndex] = newBuff;
  } else {
    state.buffs.push(newBuff);
  }

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
  elements.buffFortBonus.value = '0';
  elements.buffFortType.value = '';
  elements.buffReflexBonus.value = '0';
  elements.buffReflexType.value = '';
  elements.buffWillBonus.value = '0';
  elements.buffWillType.value = '';
  elements.buffAllsavesBonus.value = '0';
  elements.buffAllsavesType.value = '';
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
  const sign = attack.value >= 0 ? '+' : '';
  let note = '';
  if (d20 === 1) {
    note = `<span class="roll-nat-miss"> — Nat 1: Auto Miss!</span>`;
  } else if (d20 === 20) {
    note = `<span class="roll-nat-hit"> — Nat 20: Auto Hit!</span>`;
    if (critRange <= 20) note += `<span class="roll-crit-threat"> Crit Threat!</span>`;
  } else if (d20 >= critRange) {
    note = `<span class="roll-crit-threat"> — Crit Threat!</span>`;
  }
  showRoll(
    attack.label,
    `<span class="roll-d20">d20: ${d20}</span> ${sign}<span class="roll-bonus">${attack.value}</span> = <span class="roll-total">${total}</span>${note}`,
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
  ['bab', 'attr', 'damage-mod', 'damage-dice-count', 'damage-dice-type', 'crit-multiplier', 'crit-range', 'ac-armor', 'ac-armor-enh', 'ac-shield', 'ac-shield-enh', 'ac-deflection', 'ac-natural', 'save-fort-base', 'save-fort-mod', 'save-reflex-base', 'save-reflex-mod', 'save-will-base', 'save-will-mod', 'save-all-bonus'].forEach((id) => {
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

  const attackDamageToggle = document.getElementById('attack-damage-toggle');
  const attackDamageFields = document.getElementById('attack-damage-fields');
  attackDamageToggle.addEventListener('click', () => {
    const expanded = attackDamageToggle.getAttribute('aria-expanded') === 'true';
    attackDamageToggle.setAttribute('aria-expanded', String(!expanded));
    attackDamageFields.hidden = expanded;
  });

  const acToggle = document.getElementById('ac-toggle');
  const acFields = document.getElementById('ac-fields');
  acToggle.addEventListener('click', () => {
    const expanded = acToggle.getAttribute('aria-expanded') === 'true';
    acToggle.setAttribute('aria-expanded', String(!expanded));
    acFields.hidden = expanded;
  });

  const savesToggle = document.getElementById('saves-toggle');
  const savesFields = document.getElementById('saves-fields');
  savesToggle.addEventListener('click', () => {
    const expanded = savesToggle.getAttribute('aria-expanded') === 'true';
    savesToggle.setAttribute('aria-expanded', String(!expanded));
    savesFields.hidden = expanded;
  });

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

  ['fort', 'reflex', 'will'].forEach((save) => {
    const el = elements[`summary${save.charAt(0).toUpperCase() + save.slice(1)}`];
    el.addEventListener('click', () => rollSave(save));
  });

  setActiveTab(state.selectedTab);
  update();
}

init();
