'use strict';

const checkPassword = (confirm) => {
    const passwordValue = password.value;
    const confirmValue = confirm.value;

    if (passwordValue != confirmValue) {
        confirm.setCustomValidity('入力値が一致しません');
    } else {
        confirm.setCustomValidity('');
    }
}