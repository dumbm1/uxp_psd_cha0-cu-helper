document.addEventListener("DOMContentLoaded", () => { // код полностью взят у Google AI
 // Ключ для сохранения данных в localStorage
 const STORAGE_KEY = "cha0-cu-helper-settings";

 // Ссылки на элементы интерфейса
 const elements = {
  // Секция CU
  cuNumber: document.querySelector("#section_cu sp-textfield.sp-textfield_number-in-head"),
  cuRadioGroup: document.getElementById("radio_group_cu"),
  cuCheckboxes: document.querySelectorAll("#chbox_group_cu sp-checkbox"),
  cuSwitchRmMask: document.getElementById("rm_mask_cu"),
  cuSwitchLinkLay: document.getElementById("link_to_lay_cu"),

  // Секция CHA
  chaRadioGroup: document.querySelector("#section_cha sp-radio-group"),
  chaCheckboxes: document.querySelectorAll("#section_cha sp-field-group sp-checkbox"),
  chaSwitchRmMask: document.getElementById("rm_mask_cha"),
  chaSwitchLinkLay: document.getElementById("link_to_lay_cha")
 };

 // Функция сбора текущих настроек из интерфейса
 function saveSettings() {
  const settings = {
   cu: {
    number: elements.cuNumber ? elements.cuNumber.value : "2",
    radio: elements.cuRadioGroup ? elements.cuRadioGroup.value : null,
    checkboxes: Array.from(elements.cuCheckboxes).map(ch => ({ value: ch.value, checked: ch.checked })),
    rmMask: elements.cuSwitchRmMask ? elements.cuSwitchRmMask.checked : false,
    linkLay: elements.cuSwitchLinkLay ? elements.cuSwitchLinkLay.checked : false
   },
   cha: {
    radio: elements.chaRadioGroup ? elements.chaRadioGroup.value : null,
    checkboxes: Array.from(elements.chaCheckboxes).map(ch => ({ value: ch.value, checked: ch.checked })),
    rmMask: elements.chaSwitchRmMask ? elements.chaSwitchRmMask.checked : false,
    linkLay: elements.chaSwitchLinkLay ? elements.chaSwitchLinkLay.checked : false
   }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
 }

 // Функция применения сохраненных настроек к интерфейсу
 function loadSettings() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return; // Если сохраненных настроек нет, выходим (остаются дефолтные из HTML)

  try {
   const settings = JSON.parse(savedData);

   // Восстановление секции CU
   if (settings.cu) {
    if (elements.cuNumber && settings.cu.number !== undefined) elements.cuNumber.value = settings.cu.number;
    if (elements.cuRadioGroup && settings.cu.radio !== undefined) elements.cuRadioGroup.value = settings.cu.radio;
    if (elements.cuSwitchRmMask && settings.cu.rmMask !== undefined) elements.cuSwitchRmMask.checked = settings.cu.rmMask;
    if (elements.cuSwitchLinkLay && settings.cu.linkLay !== undefined) elements.cuSwitchLinkLay.checked = settings.cu.linkLay;

    if (settings.cu.checkboxes) {
     elements.cuCheckboxes.forEach(ch => {
      const savedCh = settings.cu.checkboxes.find(s => s.value === ch.value);
      if (savedCh) ch.checked = savedCh.checked;
     });
    }
   }

   // Восстановление секции CHA
   if (settings.cha) {
    if (elements.chaRadioGroup && settings.cha.radio !== undefined) elements.chaRadioGroup.value = settings.cha.radio;
    if (elements.chaSwitchRmMask && settings.cha.rmMask !== undefined) elements.chaSwitchRmMask.checked = settings.cha.rmMask;
    if (elements.chaSwitchLinkLay && settings.cha.linkLay !== undefined) elements.chaSwitchLinkLay.checked = settings.cha.linkLay;

    if (settings.cha.checkboxes) {
     elements.chaCheckboxes.forEach(ch => {
      const savedCh = settings.cha.checkboxes.find(s => s.value === ch.value);
      if (savedCh) ch.checked = savedCh.checked;
     });
    }
   }
  } catch (e) {
   console.error("Ошибка загрузки настроек плагина:", e);
  }
 }

 // Навешиваем слушатели событий для автоматического сохранения изменений
 function initListeners() {
  const inputElements = [
   elements.cuNumber,
   elements.cuRadioGroup,
   elements.cuSwitchRmMask,
   elements.cuSwitchLinkLay,
   elements.chaRadioGroup,
   elements.chaSwitchRmMask,
   elements.chaSwitchLinkLay
  ];

  // Слушаем изменения обычных полей, радио и свитчей
  inputElements.forEach(el => {
   if (el) {
    el.addEventListener("change", saveSettings);
    el.addEventListener("input", saveSettings); // Для текстовых полей / number
   }
  });

  // Слушаем чекбоксы CU
  elements.cuCheckboxes.forEach(ch => ch.addEventListener("change", saveSettings));

  // Слушаем чекбоксы CHA
  elements.chaCheckboxes.forEach(ch => ch.addEventListener("change", saveSettings));
 }

 // Запуск процесса при инициализации плагина
 loadSettings();
 initListeners();
});
