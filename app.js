

const formValidator = (form, fieldsConfig, onValidateSuccess, onValidationError) => {

    const validateField = (fieldElement, fieldConfig) => {
      const value = fieldElement.value;
      const rules = fieldConfig.rules;
      const formGroup = fieldElement.closest('.form-group');
      const errorElement = formGroup.querySelector('.form-error-message');
  
  
      const fieldValidationResult = {name: fieldConfig.name, value: value, errors: []};
      rules.forEach(rule => {
        if (rule.required && !value) {
          fieldValidationResult.errors.push(rule.message);
        }
        if (rule.maxLength && `${value}`.length > rule.maxLength) {
          fieldValidationResult.errors.push(rule.message);
        }
        if (rule.length && `${value}`.length !== rule.length) {
          fieldValidationResult.errors.push(rule.message);
        }
        if(rule.num && isNaN(Number(value))){
          fieldValidationResult.errors.push(rule.message);      
        }
        if(rule.withPlas && value.startsWith(`+`) && value.length != 13){
          fieldValidationResult.errors.push(rule.message);      
        }
        if(rule.withoutPlas && value.length !== 9 && !value.startsWith(`+`)){
          fieldValidationResult.errors.push(rule.message);      
        }
        if(rule.checkIfnum && isNaN(Number(value))&& !value.startsWith(`+`)){
          fieldValidationResult.errors.push(rule.message);      
        }
        if(rule.text && !isNaN(Number(value))){
          fieldValidationResult.errors.push(rule.message); 
        }
      });
  
      if(fieldValidationResult.errors.length > 0){
        errorElement.innerText = fieldValidationResult.errors.join('\n');
      } else {
        errorElement.innerText = '';
      }
      // console.log(fieldValidationResult);
  
      return fieldValidationResult;
    }
  
    const validateOnChange = () => {
      fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
        fieldElement.addEventListener('input', e => {
          validateField(e.target, fieldConfig);
        });
      })
    }
  
    const validateOnSubmit = () => {
      const validatedFields = [];
      fieldsConfig.forEach((fieldConfig) => {
        const fieldElement = form.querySelector(`[name="${fieldConfig.name}"]`);
        validatedFields.push(validateField(fieldElement, fieldConfig));
      });
  
      return validatedFields;
    }
  
    const listenFormSubmit = () => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        console.log('submit');
        const errors = [];
        const validationResult = validateOnSubmit();
        validationResult.forEach(result => {
          errors.push(...result.errors);
        });
        if(errors.length === 0){
          onValidateSuccess(validationResult);
        }else {
          onValidationError(validationResult);
        }
        console.log(validationResult);
      });
    }
    listenFormSubmit();
    validateOnChange();
  }
  
  const fieldsConfig = [
    {
      name: 'first_name',
      rules: [
        {required: true, message: 'First name is required.'},
        {maxLength: 10, message: 'სიბოლოების რაოდენობა უნდა იყოს 10 ზე ნაკლები ან ტოლი'},
       {text: true, message:'რიცხვების გამოყენება არ შეიძლება'}
      ]
    },
    {
      name: 'last_name',
      rules: [
        {required: true, message: 'Last name is required.'},
        {text: true, message:'რიცხვების გამოყენება არ შეიძლება'}
      ]
    },
    {
      name: 'zip_code',
      rules: [
        {required: true, message: 'Zip Code name is required.'},
        {length: 4, message:'უნდა შედგებოდეს 4 რიცხვისგან'},
        {num:`number`, message: `შეიყვანეთ  რიცხვები`},
      ]
    },
    {
      name: 'personal_number',
      rules: [
        {required: true, message: 'personal number name is required.'},
        {length: 11, message:'უნდა შედგებოდეს 11 რიცხვისგან'},
        {num:`number`, message: `შეიყვანეთ  რიცხვები`},
      ]
    },
    {
      name: 'mobile_number',
      rules: [
        {withPlas: true, message: 'უნდა შედგებოდეს 13 სიმბოლოსგან'},
        {withoutPlas: true, message: 'უნდა შედგებოდეს 9 რიცხვისგან'},
        {checkIfnum: true, message: 'უნდა შედგებოდეს რიცხვებისგან'},
    ]
    }
  
  ];
  
  
  const form = document.querySelector('#user-registraion-form');
  
  const onFormSubmitSuccess = (fields) => {
    console.log('We can send data to server', fields);
  }
  const onFormSubmitError = (fields) => {
    console.log('Error', fields);
  }
  
  formValidator(form, fieldsConfig, onFormSubmitSuccess, onFormSubmitError);

  const addUserData = (users,table) => {
    users.forEach((user) => {
        let tableRow = document.createElement(`tr`)
        tableRow.className = `id-${user.id}`
        const userKeys = Object.keys(user)
        userKeys.forEach(key => {
            let tableData = document.createElement(`td`)
            tableData.innerText = user[key]
            tableRow.appendChild(tableData)
        })
        table.appendChild(tableRow)
    })
}
const userModalId = `#user-form-modal`;
const errorModalId = `#error-modal-id`;
function modal(modalId) {
  const modalWrapper = document.querySelector(`${modalId}`);
  const modalContent = modalWrapper.querySelector('.modal-content');
  const closeBtn = modalContent.querySelector('.close');

  modalWrapper.style.display = 'block';

  modalContent.addEventListener('click', e => {
    e.stopPropagation();
  });

  modalWrapper.addEventListener('click', e => {
    modalWrapper.style.display = 'none';
  });

  closeBtn.addEventListener('click', e => {
    modalWrapper.style.display = 'none';
  });

  function close(){
    modalWrapper.style.display = 'none';
  }

  return {
    close,
  }
}
  function renderUsers(users){
    const table = document.querySelector(`.user-table`)
    addUserData(users,table)
    userActions();
  }
  
  async function userActions(){
    // ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
    // იქნება 2 ღილაკი რედაქტირება და წაშლა
    // id შეინახეთ data-user-id ატრიბუტად ღილაკებზე
    // წაშლა ღილაკზე უნდა გაიგზავნოს წაშლის მოთხოვნა და გადაეცეს id
    // ეიდტის ღილაკზე უნდა გაიხსნას მოდალ სადაც ფორმი იქნება
    // ეიდტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს და არა მასივს)
    // ეს დატა უნდა შეივსოს ფორმში formManager აქვს ახალი შესაძლებლობა formManager.setFields(userObject)
    // ეს ფუნქცია გამოიძახე და გადაეცი user-ის დატა

    async function createUser(userData){
        try {
          const response = await fetch('http://api.kesho.me/v1/user-test/create', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
          });
          await response.json();
          getUsers(); 
        }catch (e){
          console.log('ERROR!', e);
        }
      }
      
      
      // Add event listeners for modal open/close buttons
      openModalBtn.addEventListener('click', openModal);
      
      function openModal() {
        mainModal.style.display = "block";
      }
      
      closeModalBtn.addEventListener('click', closeModal);
      
      function closeModal() {
        if(mainModal.style.display == "block") {
          mainModal.style.display = "none";
        } else {
          mainModal.style.display = "block";
        }
      }