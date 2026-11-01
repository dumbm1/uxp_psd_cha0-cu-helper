/**
 * Экшн Фотошопа "затянуть слой в 2% myk"
 * создает кривую
 * привязывает к слою
 * удаляет маску
 * переименовывает кривую в '_myk+2'
 * каналы myk затягивает в 2%
 * */
async function f() {
 let linkCu = {
  "_obj": "groupEvent",
  "_target": [{
   "_enum": "ordinal",
   "_ref": "layer",
   "_value": "targetEnum",
  }],
 };
 let rmMask = {
  "_obj": "delete",
  "_target": [{
   "_enum": "ordinal",
   "_ref": "channel",
   "_value": "targetEnum",
  }],
 };
 const cuChannels = [];

 const cuChboxes = document.getElementById('section_cu').querySelectorAll('sp-checkbox');

 const CU_RANGE_PRIVATE = 255;
 const CU_RANGE_PUBLIC = 100;
 const cuRangeFactor = CU_RANGE_PRIVATE / CU_RANGE_PUBLIC;
 let cuUserInputValue = +document.getElementsByClassName('sp-textfield_number-in-head')[0].value;
 let cuCalcValue = CU_RANGE_PRIVATE - Math.round(cuRangeFactor * cuUserInputValue);
 let cuName = 'cu+'+ cuUserInputValue + '_';

 for (let i = 0; i < cuChboxes.length; i++) {
  let cuChbox = cuChboxes[i];
  if (!cuChbox.checked) {
   continue;
  }
  cuChannels.push(getCoverChannel(cuChbox.value));
  if (cuChbox.value === 'black') {
   cuName += 'K';
  } else {
   cuName += cuChbox.value.slice(0, 1).toUpperCase();
  }
 }
 if (!cuChboxes.length) return;

 function getCoverChannel(channel) {
  return {
   "_obj": "curvesAdjustment",
   "channel": {
    "_enum": "channel",
    "_ref": "channel",
    "_value": channel,
   },
   "curve": [
    {
     "_obj": "paint",
     "horizontal": 0.0,
     "vertical": 0.0,
    },
    {
     "_obj": "paint",
     "horizontal": cuCalcValue,
     "vertical": cuCalcValue,
    },
   ],
  };
 }

 let commands = [
  // Make adjustment layer
  {
   "_obj": "make",
   "_target": [
    {
     "_ref": "adjustmentLayer",
    },
   ],
   "using": {
    "_obj": "adjustmentLayer",
    "type": {
     "_obj": "curves",
     "presetKind": {
      "_enum": "presetKindType",
      "_value": "presetKindDefault",
     },
    },
   },
  },
  // Set current layer
  {
   "_obj": "set",
   "_target": [
    {
     "_enum": "ordinal",
     "_ref": "layer",
     "_value": "targetEnum",
    },
   ],
   "to": {
    "_obj": "layer",
    "name": cuName,
   },
  },
  // Set current adjustment layer
  {
   "_obj": "set",
   "_target": [
    {
     "_enum": "ordinal",
     "_ref": "adjustmentLayer",
     "_value": "targetEnum",
    },
   ],
   "to": {
    "_obj": "curves",
    "adjustment": cuChannels,
    "presetKind": {
     "_enum": "presetKindType",
     "_value": "presetKindCustom",
    },
   },
  },
 ];

 if (document.getElementById('link_to_lay_cu').checked && !hasLinkedLay()) commands.push(linkCu);
 if (document.getElementById('rm_mask_cu').checked) commands.push(rmMask);

 async function cu(executionContext, descriptor) {
  let commands = descriptor.commands;
  return await require("photoshop").action.batchPlay(commands, {});
 }

 console.log(
  await require("photoshop").core.executeAsModal(cu, {"commandName": "Action Commands", descriptor: {commands}}),
 );

}

document.getElementById('btnAddCu').addEventListener('click', f);