using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;
using System.Collections.Generic;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class CommentCourseController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<CommentCourse> GetComments(string acronym)
        {
            IEnumerable<CommentCourse> comments = null;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/CommentCourse/" + acronym);
                    var responseTask = client.GetAsync($"GetComments?acronym={acronym}");
                    responseTask.Wait();

                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<IList<CommentCourse>>();
                        readTask.Wait();
                        comments = readTask.Result;
                    }
                }
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return comments;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CommentCourse commentCourse)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/CommentCourse/");

                    var postTask = await client.PostAsJsonAsync("PostComment", commentCourse);

                    var result = postTask;

                    if (result.IsSuccessStatusCode)
                    {
                        return new JsonResult(result);
                    }
                    else
                    {
                        return new JsonResult(result);
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
                return StatusCode(500, ModelState); // Devuelves el error si ocurre una excepción
            }
        }



    }
}
