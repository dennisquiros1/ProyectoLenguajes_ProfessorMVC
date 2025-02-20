using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class NewsCommentController : Controller
    {
        [HttpGet]
        public IEnumerable<CommentNews> GetAll(int id)
        {
            IEnumerable<CommentNews> comments = null;

            try
            {
                using (var client = new HttpClient())
                {
                    {
                        client.BaseAddress = new Uri("https://localhost:7020/api/NewsComment/");
                        var responseTask = client.GetAsync("GetAll/" + id);
                        responseTask.Wait();

                        var result = responseTask.Result;


                        if (result.IsSuccessStatusCode)
                        {
                            var readTask = result.Content.ReadAsAsync<IList<CommentNews>>();
                            readTask.Wait();

                            comments = readTask.Result;

                        }
                        else
                        {
                            comments = Enumerable.Empty<CommentNews>();
                        }

                    }
                }
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }


            return comments;

        }




        [HttpGet]
        public async Task<int> CheckType(string id)
        {
            int type = 0;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/NewsComment/");

                    var response = await client.GetAsync("CheckType/" + id);

                    if (response.IsSuccessStatusCode)
                    {
                        type = await response.Content.ReadAsAsync<int>();
                    }
  
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");

            }

            return type;
        }



        [HttpGet]
        public async Task<Professor> GetProfessorCommentData(string id)
        {
            Professor auxProf = new Professor();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/NewsComment/");

                    var response = await client.GetAsync("GetProfessorCommentData/" + id);

                    if (response.IsSuccessStatusCode)
                    {
                        auxProf = await response.Content.ReadAsAsync<Professor>();
                    }

                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");

            }

            return auxProf;
        }


        [HttpGet]
        public async Task<Student> GetStudentCommentData(string id)
        {
            Student auxStudent = new Student();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/NewsComment/");

                    var response = await client.GetAsync("GetStudentCommentData/" + id);

                    if (response.IsSuccessStatusCode)
                    {
                        auxStudent = await response.Content.ReadAsAsync<Student>();
                    }

                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");

            }

            return auxStudent;
        }



    }

}


      
