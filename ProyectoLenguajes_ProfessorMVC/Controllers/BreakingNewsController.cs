using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class BreakingNewsController : Controller
    {

        [HttpGet]
        public IEnumerable<BreakingNew> Get()
        {
            IEnumerable<BreakingNew> news = null;

            try
            {
                using (var client = new HttpClient())
                {
                    {
                        client.BaseAddress = new Uri("https://localhost:7020/api/News/GetAll");
                        var responseTask = client.GetAsync("GetAll");
                        responseTask.Wait();

                        var result = responseTask.Result;


                        if (result.IsSuccessStatusCode)
                        {
                            var readTask = result.Content.ReadAsAsync<IList<BreakingNew>>();
                            readTask.Wait();

                            news = readTask.Result;

                        }
                        else
                        {
                            news = Enumerable.Empty<BreakingNew>();
                        }

                    }
                }
            }
            catch (Exception ex)
            {

                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }


            return news;

        }
    }
}
