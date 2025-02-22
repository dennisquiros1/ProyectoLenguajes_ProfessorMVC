var builder = WebApplication.CreateBuilder(args);

// Habilitar la cache en memoria (requerido para sesiones)
builder.Services.AddDistributedMemoryCache();

// Habilitar el servicio de sesiones
builder.Services.AddSession();

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Middleware para sesiones (debe ir antes de UseAuthorization)
app.UseSession();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();