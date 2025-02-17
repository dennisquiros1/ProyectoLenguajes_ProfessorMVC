using Microsoft.AspNetCore.Mvc;
using ProyectoLenguajes_ProfessorMVC.Models;

namespace ProyectoLenguajes_ProfessorMVC.Controllers
{
    public class PrivateConsultationController : ControllerBase
    {
       [HttpGet]
       public async Task<IEnumerable<PrivateConsultation>> GetByProfessor(string idProfessor)
        {
            IEnumerable<PrivateConsultation> consultations = null;

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/PrivateConsultation/GetPrivateByProfessor/" + idProfessor);
                    var responseTalk = client.GetAsync(client.BaseAddress);
                    responseTalk.Wait();

                    var result = responseTalk.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<IList<PrivateConsultation>>();
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
        public async Task<PrivateConsultation> GetById(int id)
        {
            PrivateConsultation consultation = new PrivateConsultation();

            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/PrivateConsultation/Get/" + id);
                    var responseTalk = client.GetAsync(client.BaseAddress);
                    responseTalk.Wait();

                    var result = responseTalk.Result;


                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<PrivateConsultation>();
                        readTask.Wait();
                        consultation = readTask.Result;
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Server error: {ex.Message}");
            }
            return consultation;
        }

        [HttpPut]
        public IActionResult Put([FromBody] PrivateConsultation consultation)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("https://localhost:7020/api/PrivateConsultation/");
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
                        return NoContent();
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

