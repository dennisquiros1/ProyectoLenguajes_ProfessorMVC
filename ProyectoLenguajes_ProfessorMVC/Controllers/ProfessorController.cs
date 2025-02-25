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
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/Professor/" + id);
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
        public IActionResult IsSessionActive()
        {
            var isLoggedIn = HttpContext.Session.GetString("UserId") != null;
            return Ok(new { isLoggedIn });
        }

        [HttpGet]
        public async Task<IActionResult> Authenticate(string id, string password)
        {
            int result = 0;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/Professor/");
                    var response = await client.GetAsync($"Authenticate?id={id}&password={password}");

                    if (response.IsSuccessStatusCode)
                    {
                        result = await response.Content.ReadFromJsonAsync<int>();

                        if (result == 1)
                        {
                            var professorData = GetById(id);
                            if (professorData != null)
                            {
                                HttpContext.Session.SetString("UserId", professorData.Id);
                                HttpContext.Session.SetString("UserName", professorData.Name);
                                HttpContext.Session.SetString("UserLastName", professorData.LastName);
                                HttpContext.Session.SetString("UserEmail", professorData.Email);
                                HttpContext.Session.SetString("UserPhoto", professorData.Photo);
                                HttpContext.Session.SetString("UserExpertise", professorData.Expertise);

                                return Ok(1); // Autenticación exitosa
                            }
                        }
                        else if (result == -1)
                        {
                            return Ok(-1); // Usuario no existe
                        }
                        else
                        {
                            return Ok(0); // Contraseña incorrecta
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
                return StatusCode(500, new { error = ex.Message });
            }

            return StatusCode(500, "Unknown error.");
        }


        public IActionResult GetStudentDataFromSession()
        {
            var userId = HttpContext.Session.GetString("UserId");
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not logged in.");
            }

            var professor = new Professor
            {
                Id = userId,
                Name = HttpContext.Session.GetString("UserName"),
                LastName = HttpContext.Session.GetString("UserLastName"),
                Email = HttpContext.Session.GetString("UserEmail"),
                Photo = HttpContext.Session.GetString("UserPhoto"),
                Expertise = HttpContext.Session.GetString("UserExpertise")
            };

            return Ok(professor);
        }

        [HttpGet]
        public Professor GetProfessorPhoto(string id)
        {
            Professor professor = null;

            try
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/Professor/" + id);
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
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/Professor/");
                    var responseTask = client.PutAsJsonAsync($"EditProfessor?id={id}", updatedProfessor);
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsStringAsync();
                        readTask.Wait();

                        // Actualizar los datos de la sesión
                        UpdateSessionData(updatedProfessor);

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

        private void UpdateSessionData(Professor professor)
        {
            HttpContext.Session.SetString("UserId", professor.Id);
            HttpContext.Session.SetString("UserName", professor.Name);
            HttpContext.Session.SetString("UserLastName", professor.LastName);
            HttpContext.Session.SetString("UserEmail", professor.Email);
            HttpContext.Session.SetString("UserPhoto", professor.Photo);
            HttpContext.Session.SetString("UserExpertise", professor.Expertise);
        }






    }
}
