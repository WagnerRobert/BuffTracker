const STORAGE_KEY = 'buffTrackerState';

const state = {
  buffs: [],
  inputs: {},
  selectedTab: 'summary',
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
  appliedBonus: document.getElementById('applied-bonus'),
  formulaText: document.getElementById('formula-text'),
  attackCount: document.getElementById('attack-count'),
  attackList: document.getElementById('attack-list'),
  damageAppliedBonus: document.getElementById('damage-applied-bonus'),
  precisionBonus: document.getElementById('precision-bonus'),
  nonprecisionBonus: document.getElementById('nonprecision-bonus'),
  normalDamage: document.getElementById('normal-damage'),
  critDamage: document.getElementById('crit-damage'),
  damageFormula: document.getElementById('damage-formula'),
  attackString: document.getElementById('attack-string'),
  topNormalDamage: document.getElementById('top-normal-damage'),
  topCritDamage: document.getElementById('top-crit-damage'),
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
}

function saveState() {
  const inputs = {
    bab: elements.bab.value,
    attr: elements.attr.value,
    damageMod: elements.damageMod.value,
    damageDiceCount: elements.damageDiceCount.value,
    damageDiceType: elements.damageDiceType.value,
    critMultiplier: elements.critMultiplier.value,
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

  const attackApplied = calculateAttackAppliedBuffs(state.buffs);
  const totalAttackBonus = attr + attackApplied.totalBuff;

  elements.appliedBonus.textContent = `${attackApplied.totalBuff}`;
  elements.formulaText.textContent = `${bab} + ${attr} + ${attackApplied.totalBuff}`;

  const attacks = calculateAttackSequence(bab, totalAttackBonus);
  const attackString = attacks
    .map((attack) => `${attack.value >= 0 ? '+' : ''}${attack.value}`)
    .join('/');

  elements.attackString.textContent = attackString;
  elements.attackCount.textContent = `${attacks.length}`;
  renderAttackList(attacks);

  const damageApplied = calculateDamageAppliedBuffs(state.buffs);
  renderBuffTable(state.buffs, attackApplied.appliedBuffsByType, damageApplied.appliedBuffsByType);
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

  elements.damageAppliedBonus.textContent = `${damageApplied.totalBuff}`;
  elements.precisionBonus.textContent = `${damageApplied.precisionTotal}`;
  elements.nonprecisionBonus.textContent = `${damageApplied.nonPrecisionTotal}`;
  elements.normalDamage.textContent = normalFormula;
  elements.critDamage.textContent = critFormula;
  elements.topNormalDamage.textContent = normalFormula;
  elements.topCritDamage.textContent = critFormula;
  elements.damageFormula.textContent = `Dice: ${normalDiceExpression}, Bonus: ${normalDamageBonus}`;
  saveState();
}

function calculateAttackAppliedBuffs(buffs) {
  const typed = {};
  let untypedTotal = 0;

  buffs
    .filter((buff) => buff.enabled)
    .flatMap((buff) => buff.effects.filter((effect) => effect.target === 'attack'))
    .forEach((effect) => {
      const bonus = Number(effect.bonus) || 0;
      if (effect.untyped) {
        untypedTotal += bonus;
        return;
      }

      const type = effect.type.trim().toLowerCase() || 'other';
      typed[type] = Math.max(typed[type] ?? -Infinity, bonus);
    });

  const appliedBuffsByType = Object.entries(typed).map(([type, bonus]) => ({type, bonus}));
  const typedTotal = appliedBuffsByType.reduce((sum, buff) => sum + buff.bonus, 0);
  const totalBuff = typedTotal + untypedTotal;

  return {
    totalBuff,
    appliedBuffsByType,
    untypedTotal,
  };
}

function calculateDamageAppliedBuffs(buffs) {
  const typed = {};
  const untyped = [];

  buffs
    .filter((buff) => buff.enabled)
    .flatMap((buff) => buff.effects.filter((effect) => effect.target === 'damage'))
    .forEach((effect) => {
      const bonus = Number(effect.bonus) || 0;
      const diceCount = Number(effect.diceCount) || 0;
      const effectHasValue = bonus !== 0 || diceCount > 0;

      if (!effectHasValue && !effect.untyped) {
        return;
      }

      if (effect.untyped) {
        untyped.push(effect);
        return;
      }

      const type = effect.type.trim().toLowerCase() || 'other';
      const current = typed[type];
      if (!current || bonus > Number(current.bonus)) {
        typed[type] = effect;
      }
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

  return {
    totalBuff,
    precisionTotal,
    nonPrecisionTotal,
    bonusDice,
    appliedBuffsByType,
  };
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

function renderBuffTable(buffs, attackAppliedByType, damageAppliedByType) {
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
  update();
}

function addInputListeners() {
  ['bab', 'attr', 'damage-mod', 'damage-dice-count', 'damage-dice-type', 'crit-multiplier'].forEach((id) => {
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
  setActiveTab(state.selectedTab);
  update();
}

init();
