using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class ProfessorController : ControllerBase
    {

        [HttpGet]
        public Professor GetById(string id)
        {
            Professor professor = null;

            try
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/Professor/" + id);
                    var responseTask = client.GetAsync($"GetById?id={id}");
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<Professor>();
                        readTask.Wait();
                        professor = readTask.Result;


                    }
                }

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return professor;

        }


        [HttpGet]
        public Professor GetProfessorPhoto(string id)
        {
            Professor professor = null;

            try
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/Professor/" + id);
                    var responseTask = client.GetAsync($"GetById?id={id}");
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<Professor>();
                        readTask.Wait();
                        professor = readTask.Result;


                    }
                }

            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return professor;

        }


    }
}
