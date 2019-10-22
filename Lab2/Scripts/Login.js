$(function () {
    //забороняэмо формі надсилати данні   
    $("#loginForm").submit(function (event) {
        event.preventDefault();
    });
    // надсилаємо запит для отримання токена методом POST на /Token
    $("#loginSubmit").click(function () {
        $.ajax({
            method: "post",
            url: "/Token",
            data: $("#loginForm").serialize(),
            success: function (data) {
                alert("Авторизовано користувача " + data.userName);
                //зберігаємо токен в сесії локально 
                sessionStorage.setItem("userName", data.userName);
                sessionStorage.setItem("access_token", data.access_token);
            },
            error: function (error) {
                //якщо помилка
                alert("Помилка запиту");
                console.log(error);
            }
        });
    });


    function checkStatus() {
        //отримуємо значення із сесії 
        let userName = sessionStorage.getItem("userName");
        let access_token = sessionStorage.getItem("access_token");
        if (userName && access_token) {
            $.ajax({
                method: "get",
                url: "/api/Account/UserInfo",
                //важливо в загловку запиту передати токен
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (data) {
                    console.log(data);
                    $("#userStatus").text("Авторизовано " + userName);
                },
                error: function (error) {
                    console.log(error);
                    $("#userStatus").text("Не авторизовано");
                }
            });
        }
        else
            $("#userStatus").text("Не авторизовано");
    }
    //перевірити статус користувача
    $("#checkButton").click(function () {
        checkStatus();
    });
});