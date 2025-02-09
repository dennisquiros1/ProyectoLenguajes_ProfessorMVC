using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class CourseController : ControllerBase
    {
        
        [HttpGet]
        public Course GetByAcronym(string acronym)
        {
            Course course = null;

            try
            {

                using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://localhost:7020/api/Course/" + acronym);
                var responseTask = client.GetAsync($"GetByAcronym?acronym={acronym}");
                responseTask.Wait();

                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<Course>();
                    readTask.Wait();
                    course = readTask.Result;


                }
            }

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return course;

        }


        [HttpGet]
        public IEnumerable<Course> GetByCycle(int cycle)
        {
            IEnumerable<Course> courses = null;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/Course/" + cycle);
                    var responseTask = client.GetAsync($"GetByCycle?cycle={cycle}");
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<IList<Course>>();
                        readTask.Wait();
                        courses = readTask.Result;
                    }
                }
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return courses;

        }

    }
}
