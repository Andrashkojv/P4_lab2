//використовуємо JQuery
$(function () {
    //коли сторінку повністю завантажено надсилаємо запит на отримання списку всіх книг
    $.ajax({
        method: "GET",
        url: "../api/book",
        //передаємо токен
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
        },
        success: function (bookList) {
            //якщо все успішно то показати список книг 
            Show(bookList);
        },
        error: function (error) {
            //якщо помилка
            if (error.status == 401)
                alert("АВТОРИЗУЙТЕСЯ!");
            else
                alert("Помилка");
            console.log(error);
        }
    });

    // метод для виводу списку книг в таблицю
    function Show(bookList) {
        function deleteBook(sender) {
            //Визначаэмо Id книги яку потрібно вилучити 
            let Id = $(sender.currentTarget).attr("data-id");
            //надсилаємо запит методом  DELETE
            $.ajax({
                method: "DELETE",
                url: "../api/book/" + Id,
                //передаємо токен
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                },
                success: function () {
                    //якщо все успішно то показати список книг 
                    $.ajax({
                        method: "GET",
                        url: "../api/book",
                        success: function (bookList) {
                            //якщо все успішно то показати список книг 
                            Show(bookList);
                        },
                        error: function (error) {
                            //якщо помилка
                            alert("Помилка запиту");
                            console.log(error);
                        }
                    });
                },
                error: function (error) {
                    //якщо помилка
                    alert("Помилка запиту");
                    console.log(error);
                }
            });
        }

        function editBook(sender) {
            //Визначаэмо Id книги яку потрібно редагувати
            let Id = $(sender.currentTarget).attr("data-id");
            //надсилаємо запит методом  GET для заповнення форми інформацією про книгу
            $.ajax({
                method: "GET",
                url: "../api/book/" + Id,
                //передаємо токен
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                },
                success: function (book) {
                    $("#bookForm").show();
                    for (let attr in book) {
                        $('#bookForm input[name=' + attr + ']').val(book[attr]);
                    }
                },
                error: function (error) {
                    //якщо помилка
                    alert("Помилка запиту");
                    console.log(error);
                }
            });
            //перевизначення кнопки 
            $("#bookSubmit")
                .off("click")
                .text("Оновити")
                .click(function () {
                    $.ajax({
                        method: "PATCH",
                        url: "../api/book/" + Id,
                        //передаємо токен
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                        },
                        data: $("#bookForm").serialize(), //параметри беремо з форми
                        success: function () {
                            //якщо все успішно то показати список книг 
                            $.ajax({
                                method: "GET",
                                url: "../api/book",
                                //передаємо токен
                                headers: {
                                    'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                                },
                                success: function (bookList) {
                                    //якщо все успішно то показати список книг 
                                    Show(bookList);
                                },
                                error: function (error) {
                                    //якщо помилка
                                    alert("Помилка запиту");
                                    console.log(error);
                                }
                            });
                            $("#bookForm").hide();
                        },
                        error: function (error) {
                            //якщо помилка
                            alert("Помилка запиту");
                            console.log(error);
                        }
                    });
                });
        }

        $("#bookTable>tbody").empty();//очищуємо таблицю 
        if (bookList && bookList.length > 0) { // якщо список не порожній
            for (let book of bookList) { //для кожної книги у списку
                $("#bookTable>tbody").append( //створюємо новий рядок
                    $("<tr>").append(
                        $("<td>").text(book.Title) //який доповнюємо відповідними комірками
                    ).append(
                        $("<td>").text(book.Author)
                    ).append(
                        $("<td>").text(book.Year)
                    ).append(
                        $("<td>").text(book.Pages)
                    ).append(
                        $("<td>").text(book.Price)
                    ).append(
                        $("<td>").append( //кнопка вилучення
                            $("<button>")
                                .addClass("btn")
                                .addClass("btn-danger")
                                .text("Вилучити")
                                .attr("data-id", book.Id) //зберігаємо ID 
                                .click(deleteBook) //функція виклику запиту вилучення
                        )
                    ).append(
                        $("<td>").append( //кнопка редагування
                            $("<button>")
                                .addClass("btn")
                                .addClass("btn-info")
                                .text("Редагувати")
                                .attr("data-id", book.Id) //зберігаємо ID 
                                .click(editBook) //функція виклику запиту редагування
                        )
                    )

                );
            }
        }
        else {
            $("#bookTable>tbody").text("Інформація про книги відсутня");
        }
    }

    //забороняэмо формі надсилати данні   
    $("#queryForm").submit(function (event) {
        event.preventDefault();
    });
    //обробка події кліку по кнопці
    $("#querySubmit").click(function (event) {
        //надсилаємо запит пошуку
        $.ajax({
            method: "GET",
            url: "../api/book",
            //передаємо токен
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
            },
            data: $("#queryForm").serialize(), //параметри беремо з форми
            success: function (bookList) {
                //якщо все успішно то показати список книг 
                Show(bookList);
            },
            error: function (error) {
                //якщо помилка
                alert("Помилка запиту");
                console.log(error);
            }
        });

    });


    //забороняэмо формі надсилати данні   
    $("#bookForm").submit(function (event) {
        event.preventDefault();
    });
    //обробка події кліку по кнопці
    $("#bookSubmit").click(function (event) {
        //надсилаємо запит пошуку
        $.ajax({
            method: "POST",
            url: "../api/book",
            //передаємо токен
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
            },
            data: $("#bookForm").serialize(), //параметри беремо з форми
            success: function () {
                //якщо все успішно то показати список книг 
                $.ajax({
                    method: "GET",
                    url: "../api/book",
                    //передаємо токен
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                    },
                    success: function (bookList) {
                        //якщо все успішно то показати список книг 
                        Show(bookList);
                    },
                    error: function (error) {
                        //якщо помилка
                        alert("Помилка запиту");
                        console.log(error);
                    }
                });
            },
            error: function (error) {
                //якщо помилка
                alert("Помилка запиту");
                console.log(error);
            }
        });

    });

    $("#bookForm").hide();
    $("#addBook").click(function () { //кои натискаємо кнопку "додати"
        $("#bookForm").show().trigger("reset"); //очистити і показати форму
        $("#bookSubmit")
            .off("click")
            .text("Додати")        //змінюємо кнопку на додавання
            .click(function (event) {

                $.ajax({    //надсилаємо запит додавання методом POST
                    method: "POST",
                    url: "../api/book",
                    //передаємо токен
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                    },
                    data: $("#bookForm").serialize(), //параметри беремо з форми
                    success: function () {
                        //якщо все успішно то показати список книг 
                        $.ajax({
                            method: "GET",
                            url: "../api/book",
                            //передаємо токен
                            headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem("access_token")
                            },
                            success: function (bookList) {
                                //якщо все успішно то показати список книг 
                                Show(bookList);
                                $("#bookForm").hide(); //сховати форму
                            },
                            error: function (error) {
                                //якщо помилка
                                alert("Помилка запиту");
                                console.log(error);
                            }
                        });
                    },
                    error: function (error) {
                        //якщо помилка
                        alert("Помилка запиту");
                        console.log(error);
                    }
                });

            });
    });

});