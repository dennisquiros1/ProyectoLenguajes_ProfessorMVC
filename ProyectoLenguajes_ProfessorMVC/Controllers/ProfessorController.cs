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
        public async Task<int> Authenticate(string id, string password)
        {
            int result = 0;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/Professor/");
                    var response = await client.GetAsync($"Authenticate?id={id}&password={password}");

                    if (response.IsSuccessStatusCode)
                    {
                        result = await response.Content.ReadFromJsonAsync<int>();
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return result;
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

        [HttpPut]
        public IActionResult UpdateProfessor(string id, [FromBody] Professor updatedProfessor)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/Professor/");
                    var responseTask = client.PutAsJsonAsync($"EditProfessor?id={id}", updatedProfessor);
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsStringAsync();
                        readTask.Wait();
                        return Ok(new { message = readTask.Result });  // ⬅️ DEVOLVER UN JSON VÁLIDO
                    }
                    else
                    {
                        var readTask = result.Content.ReadAsStringAsync();
                        readTask.Wait();
                        return BadRequest(new { error = readTask.Result }); // ⬅️ DEVOLVER ERROR COMO JSON
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message }); // ⬅️ DEVOLVER ERROR COMO JSON
            }
        }






    }
}
