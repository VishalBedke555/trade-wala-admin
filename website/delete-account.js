
// Delete Account Application State
const state = {
    user: {
        otpVerified: false,
        otpSent: false,
        mobileNumber: '',
        otpTimer: null,
        timerSeconds: 60,
        otpValue: ['', '', '', '', '', ''],
        checkboxes: [false, false, false]
    },
    dealer: {
        otpVerified: false,
        otpSent: false,
        mobileNumber: '',
        otpTimer: null,
        timerSeconds: 60,
        otpValue: ['', '', '', '', '', ''],
        checkboxes: [false, false, false, false]
    },
    currentForm: 'user' // 'user' or 'dealer'
};

// DOM Elements
const userAccountBtn = document.getElementById('userAccountBtn');
const dealerAccountBtn = document.getElementById('dealerAccountBtn');
const userDeleteForm = document.getElementById('userDeleteForm');
const dealerDeleteForm = document.getElementById('dealerDeleteForm');

const userMobileInput = document.getElementById('userMobile');
const dealerMobileInput = document.getElementById('dealerMobile');

const sendUserOTPBtn = document.getElementById('sendUserOTP');
const sendDealerOTPBtn = document.getElementById('sendDealerOTP');

const userOTPSection = document.getElementById('userOTPSection');
const dealerOTPSection = document.getElementById('dealerOTPSection');

const userOTPInputs = userOTPSection.querySelectorAll('.otp-input');
const dealerOTPInputs = dealerOTPSection.querySelectorAll('.otp-input');

const resendUserOTPBtn = document.getElementById('resendUserOTP');
const resendDealerOTPBtn = document.getElementById('resendDealerOTP');

const verifyUserOTPBtn = document.getElementById('verifyUserOTP');
const verifyDealerOTPBtn = document.getElementById('verifyDealerOTP');

const userTimer = document.getElementById('userTimer');
const dealerTimer = document.getElementById('dealerTimer');

const userCheckboxes = [
    document.getElementById('userConfirm1'),
    document.getElementById('userConfirm2'),
    document.getElementById('userConfirm3')
];

const dealerCheckboxes = [
    document.getElementById('dealerConfirm1'),
    document.getElementById('dealerConfirm2'),
    document.getElementById('dealerConfirm3'),
    document.getElementById('dealerConfirm4')
];

const deleteUserBtn = document.getElementById('deleteUserBtn');
const deleteDealerBtn = document.getElementById('deleteDealerBtn');

const cancelUserBtn = document.getElementById('cancelUserBtn');
const cancelDealerBtn = document.getElementById('cancelDealerBtn');

const confirmationModal = document.getElementById('confirmationModal');
const modalConfirmDelete = document.getElementById('modalConfirmDelete');
const modalCancelDelete = document.getElementById('modalCancelDelete');

const successMessage = document.getElementById('successMessage');
const continueBtn = document.getElementById('continueBtn');

// Account Type Switching
userAccountBtn.addEventListener('click', () => {
    if (state.currentForm !== 'user') {
        switchToUserForm();
    }
});

dealerAccountBtn.addEventListener('click', () => {
    if (state.currentForm !== 'dealer') {
        switchToDealerForm();
    }
});

function switchToUserForm() {
    // Update UI
    userAccountBtn.classList.add('active');
    dealerAccountBtn.classList.remove('active');
    userDeleteForm.classList.add('active');
    dealerDeleteForm.classList.remove('active');

    // Update state
    state.currentForm = 'user';

    // Reset OTP section visibility
    if (state.user.otpSent) {
        userOTPSection.classList.add('active');
    } else {
        userOTPSection.classList.remove('active');
    }

    // Update delete button state
    updateDeleteButtonState();
}

function switchToDealerForm() {
    // Update UI
    dealerAccountBtn.classList.add('active');
    userAccountBtn.classList.remove('active');
    dealerDeleteForm.classList.add('active');
    userDeleteForm.classList.remove('active');

    // Update state
    state.currentForm = 'dealer';

    // Reset OTP section visibility
    if (state.dealer.otpSent) {
        dealerOTPSection.classList.add('active');
    } else {
        dealerOTPSection.classList.remove('active');
    }

    // Update delete button state
    updateDeleteButtonState();
}

// Send OTP Functions
sendUserOTPBtn.addEventListener('click', () => {
    const mobile = userMobileInput.value.trim();

    if (!validateMobileNumber(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // Store mobile number
    state.user.mobileNumber = mobile;
    state.user.otpSent = true;

    // Show OTP section
    userOTPSection.classList.add('active');

    // Start timer
    startOTPTimer('user');

    // Disable send button
    sendUserOTPBtn.disabled = true;
    sendUserOTPBtn.innerHTML = '<i class="fas fa-check"></i> OTP Sent';

    // Demo message
    alert(`OTP sent to ${mobile}. Demo OTP: 123456`);
});

sendDealerOTPBtn.addEventListener('click', () => {
    const mobile = dealerMobileInput.value.trim();

    if (!validateMobileNumber(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    // Store mobile number
    state.dealer.mobileNumber = mobile;
    state.dealer.otpSent = true;

    // Show OTP section
    dealerOTPSection.classList.add('active');

    // Start timer
    startOTPTimer('dealer');

    // Disable send button
    sendDealerOTPBtn.disabled = true;
    sendDealerOTPBtn.innerHTML = '<i class="fas fa-check"></i> OTP Sent';

    // Demo message
    alert(`OTP sent to ${mobile}. Demo OTP: 123456`);
});

// OTP Timer Functions
function startOTPTimer(formType) {
    clearInterval(state[formType].otpTimer);
    state[formType].timerSeconds = 60;

    const timerElement = formType === 'user' ? userTimer : dealerTimer;
    const resendBtn = formType === 'user' ? resendUserOTPBtn : resendDealerOTPBtn;

    resendBtn.disabled = true;

    state[formType].otpTimer = setInterval(() => {
        state[formType].timerSeconds--;
        timerElement.textContent = `(${state[formType].timerSeconds}s)`;

        if (state[formType].timerSeconds <= 0) {
            clearInterval(state[formType].otpTimer);
            timerElement.textContent = '';
            resendBtn.disabled = false;
            resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend OTP';
        }
    }, 1000);
}

// Resend OTP
resendUserOTPBtn.addEventListener('click', () => {
    if (state.user.mobileNumber) {
        startOTPTimer('user');
        alert(`OTP resent to ${state.user.mobileNumber}. Demo OTP: 123456`);
    }
});

resendDealerOTPBtn.addEventListener('click', () => {
    if (state.dealer.mobileNumber) {
        startOTPTimer('dealer');
        alert(`OTP resent to ${state.dealer.mobileNumber}. Demo OTP: 123456`);
    }
});

// OTP Input Handling
function setupOTPInputs(inputs, formType) {
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;

            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                state[formType].otpValue[index] = '';
                return;
            }

            // Limit to one digit
            if (value.length > 1) {
                e.target.value = value.slice(0, 1);
            }

            state[formType].otpValue[index] = e.target.value;

            // Auto-focus next input
            if (value.length === 1 && index < 5) {
                inputs[index + 1].focus();
            }

            // Update UI
            updateOTPUI(inputs, formType);
            updateVerifyButtonState(formType);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                inputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6);
            if (/^\d{6}$/.test(pasteData)) {
                pasteData.split('').forEach((digit, i) => {
                    if (i < 6) {
                        state[formType].otpValue[i] = digit;
                        inputs[i].value = digit;
                        inputs[i].classList.add('filled');
                    }
                });
                updateOTPUI(inputs, formType);
                updateVerifyButtonState(formType);
            }
        });
    });
}

// Initialize OTP inputs
setupOTPInputs(userOTPInputs, 'user');
setupOTPInputs(dealerOTPInputs, 'dealer');

function updateOTPUI(inputs, formType) {
    inputs.forEach((input, index) => {
        if (state[formType].otpValue[index]) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }
    });
}

function updateVerifyButtonState(formType) {
    const isComplete = state[formType].otpValue.every(digit => digit !== '');
    const verifyBtn = formType === 'user' ? verifyUserOTPBtn : verifyDealerOTPBtn;

    verifyBtn.disabled = !isComplete;
}

// Verify OTP
verifyUserOTPBtn.addEventListener('click', () => {
    const enteredOTP = state.user.otpValue.join('');
    if (enteredOTP === '123456') {
        state.user.otpVerified = true;
        alert('OTP verified successfully!');
        updateDeleteButtonState();
    } else {
        alert('Invalid OTP. Please try again. Demo OTP is 123456');
    }
});

verifyDealerOTPBtn.addEventListener('click', () => {
    const enteredOTP = state.dealer.otpValue.join('');
    if (enteredOTP === '123456') {
        state.dealer.otpVerified = true;
        alert('OTP verified successfully!');
        updateDeleteButtonState();
    } else {
        alert('Invalid OTP. Please try again. Demo OTP is 123456');
    }
});

// Checkbox Handling
function setupCheckboxes(checkboxes, formType, index) {
    checkboxes.forEach((checkbox, i) => {
        checkbox.addEventListener('change', () => {
            state[formType].checkboxes[i] = checkbox.checked;
            updateDeleteButtonState();
        });
    });
}

setupCheckboxes(userCheckboxes, 'user', 0);
setupCheckboxes(dealerCheckboxes, 'dealer', 1);

// Update Delete Button State
function updateDeleteButtonState() {
    if (state.currentForm === 'user') {
        const allChecked = state.user.checkboxes.every(checked => checked);
        deleteUserBtn.disabled = !(allChecked && state.user.otpVerified);
    } else {
        const allChecked = state.dealer.checkboxes.every(checked => checked);
        deleteDealerBtn.disabled = !(allChecked && state.dealer.otpVerified);
    }
}

// Cancel Buttons
cancelUserBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel account deletion?')) {
        resetUserForm();
        alert('Account deletion cancelled.');
    }
});

cancelDealerBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel account deletion?')) {
        resetDealerForm();
        alert('Account deletion cancelled.');
    }
});

// Delete Buttons
deleteUserBtn.addEventListener('click', () => {
    confirmationModal.classList.add('active');
});

deleteDealerBtn.addEventListener('click', () => {
    confirmationModal.classList.add('active');
});

// Modal Actions
modalConfirmDelete.addEventListener('click', () => {
    confirmationModal.classList.remove('active');

    // Show success message
    userDeleteForm.style.display = 'none';
    dealerDeleteForm.style.display = 'none';
    successMessage.classList.add('active');

    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth' });

    // Reset forms
    resetUserForm();
    resetDealerForm();
});

modalCancelDelete.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
    alert('Account deletion cancelled. Your account remains active.');
});

// Continue Button
continueBtn.addEventListener('click', () => {
    alert('In a real application, this would redirect to the homepage.');
    // window.location.href = 'index.html';
});

// FAQ Toggle
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// Helper Functions
function validateMobileNumber(mobile) {
    return /^\d{10}$/.test(mobile);
}

function resetUserForm() {
    // Reset state
    state.user.otpVerified = false;
    state.user.otpSent = false;
    state.user.mobileNumber = '';
    state.user.otpValue = ['', '', '', '', '', ''];
    state.user.checkboxes = [false, false, false];

    // Reset UI
    userMobileInput.value = '';
    userOTPInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    userOTPSection.classList.remove('active');
    sendUserOTPBtn.disabled = false;
    sendUserOTPBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
    userCheckboxes.forEach(cb => cb.checked = false);
    resendUserOTPBtn.disabled = true;
    verifyUserOTPBtn.disabled = true;
    deleteUserBtn.disabled = true;

    // Clear timer
    clearInterval(state.user.otpTimer);
    userTimer.textContent = '';
}

function resetDealerForm() {
    // Reset state
    state.dealer.otpVerified = false;
    state.dealer.otpSent = false;
    state.dealer.mobileNumber = '';
    state.dealer.otpValue = ['', '', '', '', '', ''];
    state.dealer.checkboxes = [false, false, false, false];

    // Reset UI
    dealerMobileInput.value = '';
    dealerOTPInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    dealerOTPSection.classList.remove('active');
    sendDealerOTPBtn.disabled = false;
    sendDealerOTPBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
    dealerCheckboxes.forEach(cb => cb.checked = false);
    resendDealerOTPBtn.disabled = true;
    verifyDealerOTPBtn.disabled = true;
    deleteDealerBtn.disabled = true;

    // Clear timer
    clearInterval(state.dealer.otpTimer);
    dealerTimer.textContent = '';
}

// Mobile input validation
[userMobileInput, dealerMobileInput].forEach(input => {
    input.addEventListener('input', (e) => {
        // Remove non-numeric characters
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
});

// Initialize
updateDeleteButtonState();