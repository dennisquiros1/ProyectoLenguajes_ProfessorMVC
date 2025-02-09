const modals = document.querySelectorAll('.custom-modal');
const closeButtons = document.querySelectorAll('.custom-modal-close');
const navigationBar = document.getElementById('navBar');

$(document).ready(function () {
    GetCoursesByCycle(1);
    //GetNewsById("SV-200");
    //LoadProfessor();

    $("#cicles").change(function () {
        let romanCycle = $(this).val();
        let cycle = convertRomanToInt(romanCycle);
        GetCoursesByCycle(cycle);
    });


    //Correct exception handling is still missing
});


function convertRomanToInt(roman) {
    const romanMap = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8 };
    return romanMap[roman] || 0;
}

function GetCoursesByCycle(cycle) {
    $.ajax({
        url: "/Course/GetByCycle?cycle=" + cycle,
        type: "GET",
        data: { cycle: cycle },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (courses) {
            let tableBody = $("#coursesTable tbody");
            tableBody.empty(); 

            if (courses.length > 0) {
                $.each(courses, function (index, course) {
                    let row = `<tr>
                                <td>${course.acronym}</td>
                                <td>${course.name}</td>
                                <td><a href="#about" onclick="GetCourseByAcronym('${course.acronym}')">>></a></td>
                              </tr>`;
                    tableBody.append(row);
                });

                
                GetCourseByAcronym(courses[0].acronym); 
            } else {
                
                tableBody.append(`<tr><td colspan="3" class="text-center">No courses found</td></tr>`);
            }
        },
        error: function () {
            alert("Error retrieving courses.");
        }
    });
}

function GetCourseByAcronym(acronym) {
    $.ajax({
        url: "/Course/GetByAcronym?acronym=" + acronym,  
        type: "GET",
        data: { acronym: acronym },  
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                
                console.log(result);
                displayCourseInfo(result);  

            } else {
                alert("No se encontró el curso.");
            }
        },
        error: function (errorMessage) {
            alert("Error al obtener el curso.");
        }
    });
}
function displayCourseInfo(course) {
    GetCommentsByCourseId(course.acronym);
    $('#courseAcronym').text(course.acronym); 
    $('#courseName').text(course.name);
    $('#courseDescription').text(course.description); 
    GetProfessorByCourse(course.idProfessor); 

}

function GetProfessorByCourse(id) {
    $.ajax({
        url: "/Professor/GetById?id=" + id,  
        type: "GET",
        data: { id: id }, 
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
               
                $('#assignedTeacher').text(result.name + " " + result.lastName);
                const imgElement = document.getElementById('imageUser');
                const base64Comment = result.photo;//Change for the photo de user in the application
                base64ToImage(base64Comment, imgElement);
            } else {
                alert("No hay profesor asociado a este curso.");
            }
        },
        error: function (errorMessage) {
            alert("Error al obtener el profesor.");
        }
    });
}

function GetCommentsByCourseId(courseId) {
    $.ajax({
        url: "/CommentCourse/GetComments?acronym=" + courseId,
        type: "GET",
        data: { courseId : courseId },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (comments) {
            loadComentarios(comments);
        },
        error: function (errorMessage) {
            console.error("Error fetching comments:", errorMessage);
        }
    });
}

function loadComentarios(comments) {
    $(".course-comment-loader").empty();

    comments.forEach(comment => {

        var uniqueId = `img-${Math.random().toString(36).substr(2, 9)}`;

        var commentHtml = `
            <div class="media">
                <div class="col-sm-3 col-lg-2 hidden-xs">
                    <img id="${uniqueId}" class="comment-media-object" src="/images/defaultpfp.jpg" alt="">
                </div>
                <div class="comment col-xs-12 col-sm-9 col-lg-10">
                    <h4 class="media-heading">${comment.idUser}</h4>
                    <p>${comment.contentC}</p>
                </div>
            </div>
        `;

        $(".course-comment-loader").append(commentHtml);

        GetPhoto(comment.idUser, "Professor")
            .then(photo => {
                if (!photo) {
                    return GetPhoto(comment.idUser, "Student");
                }
                return photo;
            })
            .then(photo => {
                if (photo) {
                    document.getElementById(uniqueId).src = `data:image/png;base64,${photo}`;
                }
            })
            .catch(() => {
                alert("Error to take photo.");
            });
    });
}

function GetPhoto(id, type) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/${type}/Get${type}Photo`,
            type: "GET",
            data: { id: id },
            contentType: "application/json;charset=utf-8",
            dataType: "json"
        })
            .done(result => {
                if (result && result.photo) {
                    resolve(result.photo);
                } else {
                    resolve(null);
                }
            })
            .fail(() => {
                reject();
            });
    });
}

function postComment() {
    var contentC = $("#textareacomment").val().trim(); 
    var acronym = $("#courseAcronym").text().trim(); 
    var commentData = {
        contentC: contentC,
        acronym: acronym,
        idUser: "C36373"
    };
    $.ajax({
        url: "/CommentCourse/Post",
        type: "POST",
        data: JSON.stringify(commentData),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#message").val("");
            GetCommentsByCourseId(acronym);
            $("#textareacomment").val("")
        },
        error: function (error) {
            alert("Error al enviar el comentario.");
            console.log(error);
        }
    });
}


function openModal(modal) {
    modal.style.display = 'flex';
    navigationBar.style.display = 'none';
}
function closeModal(modal) {
    modal.style.display = 'none';
    navigationBar.style.display = 'block';
}



closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.custom-modal');
        closeModal(modal);
    });
});
window.addEventListener('click', (event) => {
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});
//Add other Modals


// Link Discussion button to Course Discussion modal
const discussionButton = document.getElementById('discussionButton');
const courseModal = document.getElementById('courseModal');
discussionButton.addEventListener('click', () => {
    openModal(courseModal);
});

//Conversors
function imageToBase64(imgElement, callback) {
    const img = imgElement; // Elemento <img>
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Convertir la imagen a Base64 (formato PNG)
    const base64String = canvas.toDataURL('image/png');

    callback(base64String);
}

//Method for pass base64 to <img>
function base64ToImage(base64String, imgElement) {
    imgElement.src = `data:image/png;base64,${base64String}`;
}


/*
function LoadProfessor() {
    $.ajax({
        url: "/Professor/Get",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (professorList) {
            let professorSelect = $("#professorSelect"); // Asegúrate de tener un <select> con este ID
            professorSelect.empty(); // Limpiar opciones antes de agregar nuevas

            $.each(professorList, function (index, professor) {
                let option = `<option value="${professor.id}">${professor.name} (${professor.id})</option>`;
                professorSelect.append(option);
            });
        },
        error: function () {
            alert("Error fetching professors");
        }
    });
}

function PostApplicationConsultation() {
   
       

    let appointmentType = $("#appointmentType").val(); // Obtener el valor del select

        if (appointmentType === "0") { // Solo ejecuta si el select está en "0"

            let professorSelect = $("#professorSelect option:selected"); // Obtiene la opción seleccionada
            let professorId = professorSelect.val(); // Obtiene el ID del profesor
            let professorName = professorSelect.text().replace(/\s*\(\d+\)$/, ''); // Extrae el nombre sin el ID

            let applicationData = {
                Text: $("#txtConsult").val(), // Asegurar que este input exista en el HTML
                Student: {
                    Id: "C36373", // Asegurar que el campo de estudiante exista
                    Name: "Jose Luis"
                },

                Professor: {
                    Id: professorId,
                    Name: professorName
                }
            };

            $.ajax({
                url: "/ApplicationConsultation/Post",
                type: "POST",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(applicationData),
                dataType: "json",
                success: function (response) {
                    alert("Consulta enviada exitosamente");
                },
                error: function (error) {
                    alert("Error al enviar la consulta");
                }
            });
        } else {
            alert("Seleccione una opción válida para enviar la consulta.");
        }
    
}


function PostApplicationConsultation() {



    let appointmentType = $("#appointmentType").val(); // Obtener el valor del select

    if (appointmentType === "1") { // Solo ejecuta si el select está en "0"

        let professorSelect = $("#professorSelect option:selected"); // Obtiene la opción seleccionada
        let professorId = professorSelect.val(); // Obtiene el ID del profesor
        let professorName = professorSelect.text().replace(/\s*\(\d+\)$/, ''); // Extrae el nombre sin el ID

        let applicationData = {
            Text: $("#txtConsult").val(), // Asegurar que este input exista en el HTML
            Student: {
                Id: "C36373", // Asegurar que el campo de estudiante exista
                Name: "Jose Luis"
            },

            Professor: {
                Id: professorId,
                Name: professorName
            }
        };

        $.ajax({
            url: "/PrivateConsultation/Post",
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(applicationData),
            dataType: "json",
            success: function (response) {
                alert("Consulta enviada exitosamente");
            },
            error: function (error) {
                alert("Error al enviar la consulta");
            }
        });
    } else {
        alert("Seleccione una opción válida para enviar la consulta.");
    }

}


function AuthenticateStudent() {
    // Construir el objeto student con los valores del formulario
    let student = {
        id: $("#lId").val(),
        password: $("#lPassword").val()
    };

    // Enviar los datos al backend con AJAX
    $.ajax({
        url: "/Student/Authenticate",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(student), // Convertir objeto a JSON
        dataType: "json",
        success: function (response) {
            alert("Authentication successful!");
            // Aquí puedes redirigir o realizar otras acciones si es necesario
        },
        error: function () {
            alert("Error authenticating. Check your credentials and try again.");
        }
    });
}
function PostStudent() {
    // Construir el objeto student con los valores del formulario
    let student = {
        id: $("#rId").val(),
        name: $("#rName").val(),
        lastName: $("#rSname").val(),
        email: $("#rMail").val(),
        password: $("#rPassword").val(),
        likings: null  // Solo un valor, no un arreglo
    };

    student.likings = $("input[name='intereses[]']:checked").val();

   

    // Enviar los datos al backend con AJAX
    $.ajax({
        url: "/Student/Post",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(student), // Convertir objeto a JSON
        dataType: "json",
        success: function (response) {
            alert("Student registered successfully!");
        },
        error: function () {
            alert("Error registering student. Try again.");
        }
    });
}
function GetNewsById(idNot) {
    $.ajax({
        url: "/BreakingNew/Get",
        type: "GET",
        data: { idNot: idNot },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
                addNewsComponent(result);
            } else {
                alert("No se encontró la noticia.");
            }
        },
        error: function (errorMessage) {
            alert("Error al obtener la noticia.");
        }
    });
}
function addNewsComponent(news) {
    // Crear nuevo elemento HTML para la noticia
    var newsItem = `
        <div class="news-item">
            <img src="${news.imageUrl}" alt="News Image" class="news-image" />
            <div class="news-content">
                <h3 class="news-title">${news.title}</h3>
                <a href="#" class="more-about-link"
                   data-title="${news.title}"
                   data-date="${news.date}"
                   data-paragraph="${news.paragraph}"
                   data-photo="${news.photo ? btoa(String.fromCharCode.apply(null, news.photo)) : ''}">
                    <u>More about</u>
                </a>
            </div>
        </div>`;

    // Agregar la noticia al contenedor
    $("#newsContainer").append(newsItem);

    // Asignar evento de apertura del modal
    $(".more-about-link").last().on("click", function (e) {
        e.preventDefault(); // Evita la navegación por defecto

        // Obtener datos desde `data-attributes`
        var title = $(this).data("title");
        var date = $(this).data("date");
        var paragraph = $(this).data("paragraph");
        var photo = $(this).data("photo");
        var id = $(this).data("id");

        // Rellenar el modal con la información correcta usando selectores de clase
        $(".news-title").text(title);
        $(".news-date").text("Published on: " + date);
        $(".news-body").text(paragraph);

        // Manejar la imagen
        if (photo) {
            $(".news-image").attr("src", "data:image/png;base64," + photo);
        } else {
            $(".news-image").attr("src", "/images/default.jpg"); // Imagen por defecto
        }
        GetCommentNewById(news.idNot)
        // Mostrar el modal
        $("#newsModal").fadeIn();
    });
}
// Evento para cerrar el modal
$(".custom-modal-close").on("click", function () {
    $("#newsModal").fadeOut();
});
function GetCommentNewById(id) {
    $.ajax({
        url: "/CommentNew/Get",  // Ruta al controlador y método
        type: "GET",
        data: { id: id },  // Parámetro id que se pasa al método
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result && result.length > 0) {
                // Aquí agregamos los comentarios al contenedor
                addCommentsToContainer(result);
            } else {
                alert("No se encontraron comentarios.");
            }
        },
        error: function (errorMessage) {
            alert("Error al obtener los comentarios.");
        }
    });
}
function addCommentsToContainer(comments) {
    // Limpiar el contenedor antes de agregar los nuevos comentarios
    $(".news-comment-loader").empty();

    // Recorrer todos los comentarios y agregarlos al contenedor
    comments.forEach(function (comment) {
        var commentHtml = `
            <div class="comment col-xs-12 col-sm-9 col-lg-10">
                <h4 class="media-heading">${comment.name1}</h4>
                <p>${comment.content}</p>
            </div>
        `;
        // Agregar el comentario al contenedor
        $(".news-comment-loader").append(commentHtml);
    });
}

function PutStudent() {
    // Construir el objeto student con los valores del formulario
    let student = {
        id: "C36373",
        name: $("#pName").val(),
        lastName: $("#pSname").val(),
        email: $("#pMail").val(),
        password: $("#pPassword").val(),
        likings: null // Solo un valor, no un arreglo
    };

    student.likings = $("input[name='intereses[]']:checked").val();

    // Enviar los datos al backend con AJAX usando PUT
    $.ajax({
        url: "/Student/Put", // Endpoint del método en el controlador
        type: "PUT",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(student), // Convertir objeto a JSON
        dataType: "json",
        success: function (response) {
            alert("Student updated successfully!");
        },
        error: function () {
            alert("Error updating student. Try again.");
        }
    });
}



const profileNav = document.getElementById('profileNav');
const profileModal = document.getElementById('profileModal');
profileNav.addEventListener('click', (event) => {
    event.preventDefault();
    openModal(profileModal);
});
const newsModal = document.getElementById('newsModal');
const moreAboutLinks = document.querySelectorAll(".more-about-link");
moreAboutLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(newsModal);
    });
});
*/
