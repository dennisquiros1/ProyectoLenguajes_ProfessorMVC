using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class NewsCommentController : Controller
    {
        [HttpGet]
        public IEnumerable<CommentNews> Get(int id)
        {
            IEnumerable<CommentNews> comments = null;

            try
            {
                using (var client = new HttpClient())
                {
                    {
                        client.BaseAddress = new Uri("https://localhost:7086/api/NewsComment/GetAll/");
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
        public int checkComment(int id) {

            int type = 0;

            try
            {
                using (var client = new HttpClient())
                {
                    {
                        client.BaseAddress = new Uri("https://localhost:7086/api/NewsComment/CheckType/");
                        var responseTask = client.GetAsync("CheckType/" + id);
                        responseTask.Wait();


                        var result = responseTask.Result;

                        if (result.IsSuccessStatusCode)
                        {

                            var readTask = result.Content.ReadAsAsync<int>();
                            readTask.Wait(); 
                            type = readTask.Result;

                        }
                        else
                        {

                            type = -2; //error
                        }

                    }

                }

            }catch(Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }

            return type;

        }
    }
}