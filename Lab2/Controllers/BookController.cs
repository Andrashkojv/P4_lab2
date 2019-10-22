using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
//використання моделі
using Lab2.Models;

namespace Lab1.Controllers
{
    //Вказуємо необхідність авторизуватися
    [Authorize]
    public class BookController : ApiController
    {
        //точка доступу до бази через моделі
        private BooksEntities db = new BooksEntities();

        // метод GET на ../api/book
        // результат  HttpActionResult - універсальний  результат запиту
        
        public IHttpActionResult Get()
        {
            // спробувати повернути список книг
            try
            {
                return Ok(db.Book.ToList());
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }
        // запит кних виданих у вказаному році Year, ціна яких не перевищує  MaxPrice
        //[FromUri]  - показує що дані передаються через рядок запиту ../api/book?Year=2017&MaxPrice=200.59
        public IHttpActionResult Get([FromUri] int Year, [FromUri] float MaxPrice)
        {
            // спробувати повернути список книг що відповідають умові
            try
            {
                //умова задається як лямбда вираз який кладе у відповідніть книзі виконання умови
                return Ok(db.Book.Where(book => (book.Year == Year) && (book.Price <= MaxPrice)).ToList());
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }
        //запит GET для одної книги, пошук по ID  ./api/book/2 
        public IHttpActionResult Get(int Id)
        {
            // спробувати повернути книгу із вказаним ID
            try
            {
                //шукаэмо книгу по ключовому полю
                Book result = db.Book.Find(Id);
                //якщо книгу не знайдено то результат буде null 
                if (result == null)
                    return NotFound();
                //інакше повертаємо книгу
                else
                    return Ok(result);
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }

        //метод додавання нової книги.
        //[FromBody]  - інформація про книгу передається в тілі запиту
        public IHttpActionResult Post([FromBody] Book book)
        {
            // спробувати додати кнгу
            try
            {
                db.Book.Add(book);
                db.SaveChanges();
                return Ok(book);
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }

        //запит вилучення одної книги, пошук по ID  ../api/book/2 
        public IHttpActionResult Delete(int Id)
        {
            // спробувати повернути книгу із вказаним ID
            try
            {
                //шукаэмо книгу по ключовому полю
                Book book = db.Book.Find(Id);
                //якщо книгу не знайдено то результат буде null 
                if (book == null)
                    return NotFound();
                //інакше Вилучаємо книгу
                else
                {
                    db.Book.Remove(book);
                    db.SaveChanges();
                    return Ok();
                }
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }

        //метод  редагування інформації книги.
        //[FromBody]  - інформація про книгу передається в тілі запиту
        public IHttpActionResult Patch(int Id, [FromBody] Book book)
        {
            // спробувати оновити інформацію про книгу
            try
            {
                db.Entry(book).State = EntityState.Modified;
                db.SaveChanges();
                return Ok(book);
            }
            // якщо трапиться помилка - повернути Internal Server Error
            catch (Exception error)
            {
                return InternalServerError(error);
            }
        }
    }
}
