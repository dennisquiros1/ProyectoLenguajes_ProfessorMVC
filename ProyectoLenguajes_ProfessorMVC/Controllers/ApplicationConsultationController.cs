using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;
using System.Threading.Tasks;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class ApplicationConsultationController : ControllerBase
    {
        [HttpGet]
        public async Task<IEnumerable<ApplicationConsultation>> GetByProfessor(string idProfessor)
        {
            IEnumerable<ApplicationConsultation> consultations = null;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/ApplicationConsultation/GetByProfessor/" + idProfessor);
                    var responseTalk = client.GetAsync(client.BaseAddress);
                    responseTalk.Wait();

                    var result = responseTalk.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<IList<ApplicationConsultation>>();
                        readTask.Wait();
                        consultations = readTask.Result;
                    }

                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }
            return consultations;
        }

        [HttpGet]
        public async Task<ApplicationConsultation> GetById(int id)
        {
            ApplicationConsultation consultation = new ApplicationConsultation();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/ApplicationConsultation/Get/" + id);
                    var responseTalk = client.GetAsync(client.BaseAddress);
                    responseTalk.Wait();

                    var result = responseTalk.Result;


                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<ApplicationConsultation>();
                        readTask.Wait();
                        consultation = readTask.Result;
                    }
                }
            }catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }
            return consultation;
        }

        [HttpPut]
        public IActionResult Put([FromBody] ApplicationConsultation consultation)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://apiprofessor-chb6c2brfrdfajg3.brazilsouth-01.azurewebsites.net/api/ApplicationConsultation/");
                    var putTask = client.PutAsJsonAsync("Put/", consultation);

                    putTask.Wait();

                    var result = putTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        return new JsonResult(result);
                        // TODO: return new JsonResult(student);
                    }
                    else
                    {
                        // TODO should be customized to meet the client's needs
                        return new JsonResult(result);
                    }

                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }
            return Ok();
        }
    }
}
