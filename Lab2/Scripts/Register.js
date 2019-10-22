$(function () {
    //забороняэмо формі надсилати данні   
    $("#registerForm").submit(function (event) {
        event.preventDefault();
    });
    // надсилаємо запит для реєстрації методом POST на /api/Account/Register
    $("#registerSubmit").click(function () {
        $.ajax({
            method: "post",
            url: "/api/Account/Register",
            data: $("#registerForm").serialize(),
            success: function () {
                alert("Зареэстровано");
            },
            error: function (error) {
                //якщо помилка
                if (error.status == 401)
                    alert("Авторизуйтеся!");
                else
                    alert("Помилка запиту");
                console.log(error);
            }
        });
    });
});