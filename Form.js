let formSteps = document.querySelectorAll('.form-step');
let form = document.getElementById('multistepform');
let nextBtn = document.querySelectorAll('.next-btn');
let prevBtn = document.querySelectorAll('.prev-btn');
let success = document.getElementById('sucess-message');



let currentStep = 0;
let educationDetails = [];

let fullName = document.getElementById('name');
let age = document.getElementById('dob');
let mobileNumber = document.getElementById('mobile');
let email = document.getElementById('email');
let fatherName = document.getElementById('fathername');
let motherName = document.getElementById('mothername');
let aadhar = document.getElementById('aadhar');
let pan = document.getElementById('pan');

let higherStudiesInput = document.getElementById('higherstudies');
let universityInput = document.getElementById('university');
let percentageInput = document.getElementById('percentage');
let completeYearInput = document.getElementById('completeyear');
let addCourseInput = document.getElementById('addcourse');

nextBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validate(currentStep)) {
            formSteps[currentStep].classList.remove('active');
            currentStep++;
            formSteps[currentStep].classList.add('active');
            updateProgressBar();
        }
    });
});

prevBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        formSteps[currentStep].classList.remove('active');
        currentStep--;
        formSteps[currentStep].classList.add('active');
        updateProgressBar();
    });
});

function validate(stepIndex) {
    let fields = {
        0: ['name', 'dob', 'mobile', 'email', 'fathername', 'mothername'],
        2: ['aadhar', 'pan']
    };

    let isValid = true;
    let stepFields = fields[stepIndex] || [];

    stepFields.forEach(field => {
        let input = document.getElementById(field);
        let error = document.getElementById(`${field}-error`);
        if (!input || !error) return;

        error.textContent = "";
        input.style.border = "2px solid #ccc";

        if (!input.value) {
            error.textContent = "This field is required";
            input.style.border = "2px solid red";
            isValid = false;
        }

        if (field === 'dob' && input.value) {
            let today = new Date();
            let bDate = new Date(input.value);
            let ageDiff = today.getFullYear() - bDate.getFullYear();
            let monthDiff = today.getMonth() - bDate.getMonth();
            let dayDiff = today.getDate() - bDate.getDate();

            if (
                ageDiff < 18 ||
                (ageDiff === 18 && monthDiff < 0) ||
                (ageDiff === 18 && monthDiff === 0 && dayDiff < 0)
            ) {
                error.textContent = "You must be at least 18 years old.";
                input.style.border = "2px solid red";
                isValid = false;
            }
        }

        if (field === 'mobile' && input.value) {
            let mobilePattern = /^(?:\d{3})?[0-9]\d{9}$/;
            if (!mobilePattern.test(input.value)) {
                error.textContent = "Enter a valid Indian mobile number.";
                input.style.border = "2px solid red";
                isValid = false;
            }
        }
    });

    if (stepIndex === 0) {
        let genderGroup = document.getElementsByName('gender');
        let genderSelected = [...genderGroup].some(r => r.checked);
        let error = document.getElementById('gender-error');
        if (error) error.textContent = "";
        if (!genderSelected) {
            if (error) error.textContent = "Please select your gender.";
            isValid = false;
        }
    }

    if (stepIndex === 1) {
        let error = document.getElementById('educationdetails-error');
        if (error) error.textContent = "";
        if (educationDetails.length === 0) {
            if (error) error.textContent = "Please add at least one education entry.";
            isValid = false;
        }
    }

    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validate(0) && validate(1) && validate(2)) {
        alert('Form Submitted Successfully!');

        let genderValue = document.querySelector('input[name="gender"]:checked');

        let formData = {
            Name: fullName?.value || '',
            Age: age?.value || '',
            Gender: genderValue ? genderValue.value : '',
            MobileNumber: mobileNumber?.value || '',
            Email: email?.value || '',
            FatherName: fatherName?.value || '',
            MotherName: motherName?.value || '',
            HigherStudies: educationDetails.map(e => e.Qualification).join(', '),
            UniversityName: educationDetails.map(e => e.University).join(', '),
            Percentage: educationDetails.map(e => e.Percentage_Mark).join(', '),
            CompleteYear: educationDetails.map(e => e.CompleteYear).join(', '),
            AddCourse: educationDetails.map(e => e.AdditionalCourse).join(', '),
            AadharCard: aadhar?.value || '',
            PanCard: pan?.value || ''
        };

        localStorage.setItem('formData', JSON.stringify(formData));
        console.log(formData);

        form.style.display = 'none';
        success.style.display = 'block';
        localStorage.removeItem('staticFormData');
    }
});

function updateProgressBar() {
    let circles = document.querySelectorAll('.step-circle');
    let progress = document.getElementById('progress');

    circles.forEach((circle, index) => {
        circle.classList.toggle('active', index <= currentStep);
    });

    progress.style.width = `${(currentStep) / (formSteps.length - 1) * 100}%`;
}

function staticvalue() {
    let genderValue = document.querySelector('input[name="gender"]:checked');

    let staticFormData = {
        Name: fullName?.value || '',
        Age: age?.value || '',
        Gender: genderValue ? genderValue.value : '',
        MobileNumber: mobileNumber?.value || '',
        Email: email?.value || '',
        FatherName: fatherName?.value || '',
        MotherName: motherName?.value || '',
        AadharCard: aadhar?.value || '',
        PanCard: pan?.value || '',
        educationDetails: educationDetails
    };

    localStorage.setItem('staticFormData', JSON.stringify(staticFormData));
}

window.addEventListener('load', () => {
    let savedData = JSON.parse(localStorage.getItem('staticFormData'));

    if (savedData) {
        fullName.value = savedData.Name || '';
        age.value = savedData.Age || '';
        mobileNumber.value = savedData.MobileNumber || '';
        email.value = savedData.Email || '';
        fatherName.value = savedData.FatherName || '';
        motherName.value = savedData.MotherName || '';
        aadhar.value = savedData.AadharCard || '';
        pan.value = savedData.PanCard || '';
        if (savedData.Gender) {
            let genderRadio = document.querySelector(`input[name="gender"][value="${savedData.Gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }
        if (Array.isArray(savedData.educationDetails)) {
            educationDetails = savedData.educationDetails;
            educationDetails.forEach(ele => {
                displayEducationDetails(ele);
            });
        }
    }
});

document.getElementById('addeducation').addEventListener('click', () => {
    let HigherStudies = higherStudiesInput.value.trim();
    let UniversityName = universityInput.value.trim();
    let Percentage = percentageInput.value.trim();
    let PassOutYear = completeYearInput.value.trim();
    let AdditionalCourse = addCourseInput.value.trim();

    if (!HigherStudies || !UniversityName || !Percentage || !PassOutYear) {
        alert("Please fill in all required education fields.");
        return;
    }

    let isDuplicate = educationDetails.some(item =>
        item.Qualification === HigherStudies &&
        item.CompleteYear === PassOutYear &&
        item.AdditionalCourse === AdditionalCourse
    );

    if (isDuplicate) {
        alert("This education detail has already been added.");
        return;
    }

    let newEntryValue = {
        Qualification: HigherStudies,
        University: UniversityName,
        Percentage_Mark: Percentage,
        CompleteYear: PassOutYear,
        AdditionalCourse: AdditionalCourse
    };

    educationDetails.push(newEntryValue);
    displayEducationDetails(newEntryValue);

    higherStudiesInput.value = "";
    universityInput.value = "";
    percentageInput.value = "";
    completeYearInput.value = "";
    addCourseInput.value = "";

    staticvalue();
});

function displayEducationDetails(entry) {
    let edulist = document.getElementById('educationlist');
    let li = document.createElement('li');

    let createInput = (value, placeholder) => {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.placeholder = placeholder;
        input.style.marginRight = '10px';
        input.readOnly = true;
        return input;
    };

    let qualificationInput = createInput(entry.Qualification, 'Qualification');
    let universityInput = createInput(entry.University, 'University');
    let percentageInput = createInput(`${entry.Percentage_Mark}%`, 'Percentage');
    let yearInput = createInput(entry.CompleteYear, 'Year');
    let courseInput = createInput(entry.AdditionalCourse, 'Additional Course');

    let deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt';
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.style.color = 'red';
    deleteIcon.style.marginLeft = '10px';

    let editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-file-pen';
    editIcon.style.cursor = 'pointer';
    editIcon.style.marginLeft = '10px';

    deleteIcon.addEventListener('click', () => {
        li.remove();
        educationDetails = educationDetails.filter(item =>
            !(item.Qualification === entry.Qualification &&
              item.CompleteYear === entry.CompleteYear &&
              item.AdditionalCourse === entry.AdditionalCourse)
        );
        staticvalue();
    });

    editIcon.addEventListener('click', () => {
        qualificationInput.readOnly = false;
        universityInput.readOnly = false;
        percentageInput.readOnly = false;
        yearInput.readOnly = false;
        courseInput.readOnly = false;

    });

    li.appendChild(qualificationInput);
    li.appendChild(universityInput);
    li.appendChild(percentageInput);
    li.appendChild(yearInput);
    li.appendChild(courseInput);
    li.appendChild(deleteIcon);
    li.appendChild(editIcon);

    edulist.appendChild(li);
}

