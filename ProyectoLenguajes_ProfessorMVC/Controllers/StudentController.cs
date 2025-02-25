using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class StudentController : ControllerBase
    {

        [HttpGet]
        public Student GetStudentPhoto(string id)
        {
            Student student = null;

            try
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/Student/" + id);
                    var responseTask = client.GetAsync($"GetById?id={id}");
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<Student>();
                        readTask.Wait();
                        student = readTask.Result;


                    }
                }

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return student;

        }
    }
}
