'use strict';

const checkPassword = (confirm) => {
    var passwordValue = password.value;
    var confirmValue = confirm.value;

    if ( passwordValue != confirmValue ){
        confirm.setCustomValidity("入力値が一致しません");
    } else{
        confirm.setCustomValidity('');
    }
}