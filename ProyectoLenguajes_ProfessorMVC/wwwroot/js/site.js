let newsArray = [];
let newCurrentID = 1;


$(document).ready(function () {
    GetCoursesByCycle(1);
    loadNews();

    //Required for courses and course comments
    const courseModal = document.getElementById('courseModal');

    const month = new Date().getMonth() + 1;

    let fillHtml = "";

    if (month >= 2 && month <= 7) {
        fillHtml = `
            <option value="I">I</option>
            <option value="III">III</option>
            <option value="V">V</option>
            <option value="VII">VII</option>
        `;
    } else if (month >= 8 && month <= 12) {
        fillHtml = `
            <option value="II">II</option>
            <option value="IV">IV</option>
            <option value="VI">VI</option>
            <option value="VIII">VIII</option>
        `;
    } else {
        fillHtml = `
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
        `;
    }
    //Required for courses and course comments
    $("#cicles").html(fillHtml); 

    //Required for courses and course comments
    $("#cicles").change(function () {
        let romanCycle = $(this).val();
        let cycle = convertRomanToInt(romanCycle);
        GetCoursesByCycle(cycle);
    });


    $('#nextBtn').click(function () {
        moveNext();
        renderNews();
    });


    $('#prevBtn').click(function () {
        movePrev();
        renderNews();
    });

    LoadAppConsultations();
});

//Required for courses and course comments
function convertRomanToInt(roman) {
    const romanMap = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8 };
    return romanMap[roman] || 0;
}

//Required for courses and course comments
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

            if (courses != null) {
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



//Required for courses and course comments
function GetCourseByAcronym(acronym) {
    $.ajax({
        url: "/Course/GetByAcronym?acronym=" + acronym,  
        type: "GET",
        data: { acronym: acronym },  
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result) {
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

//Required for courses and course comments
function displayCourseInfo(course) {
    GetCommentsByCourseId(course.acronym);
    $('#courseAcronym').text(course.acronym); 
    $('#courseName').text(course.name);
    $('#courseDescription').text(course.description); 
    GetProfessorByCourse(course.idProfessor); 

}

//Required for courses and course comments
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
function AuthenticateProfessor() {
    var id = $("#lId").val();
    var password = $("#lPassword").val();

    $.ajax({
        url: "/Professor/Authenticate",
        type: "GET",
        data: { id: id, password: password },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result === 1) {
                alert("Autenticación exitosa.");
                GetProfessorData(id);
                LoadAppConsultations();
            } else if (result === -1) {
                alert("El profesor no existe.");
            } else {
                alert("Contraseña incorrecta.");
            }
        },
        error: function () {
            alert("Error al autenticar.");
        }
    });
}

function GetProfessorData(id) {
    $.ajax({
        url: "/Professor/GetById",
        type: "GET",
        data: { id: id },  // Asegurar que se envía el parámetro ID
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (professor) {
            if (professor) {
                $("#professorName").text(professor.name + " " + professor.lastName);
                $("#professorID").text(professor.id);

                $("#pName").val(professor.name);
                $("#pSname").val(professor.lastName);
                $("#pMail").val(professor.email);

                if (professor.profilePicture) {
                    $("#profileModal img").attr("src", professor.profilePicture);
                }

                $("#profileModal").show();

            } else {
                alert("No se encontraron datos del profesor.");
            }
        },
        error: function () {
            alert("Error al obtener los datos del profesor.");
        }
    });
}


//Required for courses and course comments
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

//Required for courses and course comments
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
                    <p>${comment.date}</p>
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

//Required for courses and course comments
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

//Required for courses and course comments
function postComment() {
    var contentC = $("#textareacomment").val().trim(); 
    var acronym = $("#courseAcronym").text().trim(); 

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    var commentData = {
        contentC: contentC,
        acronym: acronym,
        date: date,
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

        }
    });
}




/*****************************/
/*     Noticias              */
/*****************************/

function loadNews() {
    $.ajax({
        url: "/BreakingNews/Get",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $.each(result, function (key, item) {
                newsArray.push({
                    idNew: item.idNew,
                    title: item.title,
                    paragraph: item.paragraph,
                    photo: item.photo,
                    date: item.date
                });
            });

            console.log(newsArray.length);



            renderNews();
        },
        error: function (errorMessage) {
            alert("Error fething news");
        }
    });

}


function moveNext() {
    let firstItem = newsArray.shift(); 
    newsArray.push(firstItem);
}


function movePrev() {
 
    let lastItem = newsArray.pop();
    newsArray.unshift(lastItem);

}


function renderNews() {

    document.getElementById('newImage0').src = `data:image/png;base64,${newsArray[0].photo}`;
    document.getElementById('newImage1').src = `data:image/png;base64,${newsArray[1].photo}`;
    document.getElementById('newImage2').src = `data:image/png;base64,${newsArray[2].photo}`;

    document.getElementById('newPreviewTittle0').textContent = newsArray[0].title;
    document.getElementById('newPreviewTittle1').textContent = newsArray[1].title;
    document.getElementById('newPreviewTittle2').textContent = newsArray[2].title;


}

const link0 = document.getElementById("newsLink0");

const link1 = document.getElementById("newsLink1");

const link2 = document.getElementById("newsLink2");

link0.addEventListener('click', (event) => {
    newCurrentID = 0;
    showNew();
});

link1.addEventListener('click', (event) => {
    newCurrentID = 1;
    showNew();
});

link2.addEventListener('click', (event) => {
    newCurrentID = 2;
    showNew();

});


function showNew() {

    document.getElementById('newFullImage').src = `data:image/png;base64,${newsArray[newCurrentID].photo}`;


    document.getElementById('newTitle').textContent = newsArray[newCurrentID].title;
    document.getElementById('newDate').textContent = newsArray[newCurrentID].date;
    document.getElementById('newBody').textContent = newsArray[newCurrentID].paragraph;

    loadNewsComments(newsArray[newCurrentID].idNew);

}


function loadNewsComments(id) {
    $.ajax({
        url: "/NewsComment/GetAll/",
        type: "GET",
        data: { id: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $("#NewsCommentsLoader").empty();

            if (result.length > 0) {
                let promises = result.map(comment => {
                    return new Promise((resolve, reject) => {
                        let photo = "/images/defaultpfp.jpg";
                        let name = "Unknown!";

                        CheckNewsCommentType(comment.idUser)
                            .then(type => {
                                if (type == 1) {
                                    return GetProfessorCommentData(comment.idUser);
                                } else if (type == -1) {
                                    return GetStudentCommentData(comment.idUser);
                                }
                                return null;
                            })
                            .then(userData => {
                                if (userData) {
                                    photo = userData.photo || photo;
                                    name = userData.name || name;
                                }
                                resolve({ name, photo, comment });
                            })
                            .catch(error => {
                                console.error("Error:", error);
                                resolve({ name, photo, comment }); // Evita que un error detenga todo
                            });
                    });
                });

                // Esperamos a que todas las promesas se resuelvan antes de mostrar los comentarios
                Promise.all(promises).then(commentsData => {
                    commentsData.forEach(({ name, photo, comment }) => {
                        appendComment(name, photo, comment);
                    });
                });
            }
        },
        error: function (errorMessage) {
            console.error("Error al cargar los comentarios", errorMessage);
        }
    });
}

function appendComment(name, photo, comment) {
   
    let photoSrc = photo.startsWith("data:image") ? photo : `data:image/jpeg;base64,${photo}`;

    var commentHtml = `
        <div class="media">
            <div class="col-sm-3 col-lg-2 hidden-xs">
                <img class="comment-media-object" src="${photoSrc}" alt="User Profile">
            </div>
            <div class="comment col-xs-12 col-sm-9 col-lg-10">
                <h4 class="media-heading">${name}</h4>
                <h5 class="media-heading">${comment.date}</h5>
                <p>${comment.contentC}</p>
            </div>
        </div>
    `;

    $("#NewsCommentsLoader").append(commentHtml);
}



function CheckNewsCommentType(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/NewsComment/CheckType/",
            type: "GET",
            data: { id: id },
            contentType: "application/json;charset=utf-8",
            dataType: "text",
            success: function (result) {
    

                resolve(result);
            },
            error: function () {
                alert("Not an ID");
                reject("Error en la petición");
            }
        });
    });
}

function GetProfessorCommentData(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/NewsComment/GetProfessorCommentData/",
            type: "GET",
            data: { id: id },
            dataType: "json",
            success: function (result) {
                resolve(result);
            },
            error: function () {
                alert("Error retrieving data");
                reject("Error retrieving data");
            }
        });
    });
}

function GetStudentCommentData(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/NewsComment/GetStudentCommentData/",
            type: "GET",
            data: { id: id },
            dataType: "json",
            success: function (result) {
                resolve(result);
            },
            error: function () {
                alert("Error retrieving data");
                reject("Error retrieving data");
            }
        });
    });
}





//Converters / Util stuff

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
function UpdateProfessor() {
    var id = $("#professorID").text().trim(); // Asegurar que el ID se obtiene bien

    var updatedProfessor = {
        Id: id,
        Name: $("#pName").val(),      
        LastName: $("#pSname").val(),
        Email: $("#pMail").val(),
        Password: $("#pPass").val()
    };

    $.ajax({
        url: "/Professor/UpdateProfessor?id=" + encodeURIComponent(id), // ID en la URL
        type: "PUT",
        data: JSON.stringify(updatedProfessor), // Enviar solo el objeto como JSON
        contentType: "application/json", // IMPORTANTE: Indicar que es JSON
        processData: false, // IMPORTANTE: Evitar que jQuery procese los datos
        dataType: "json",
        success: function (response) {
            GetProfessorData(id);
        },
        error: function (error) {
            alert("Error al editar profesor");

        }
    });
}

function LoadAppConsultations() {
    var id = $("#professorID").text().trim(); //to change

    $.ajax({
        url: "/ApplicationConsultation/GetByProfessor/" + id,
        type: "GET",
        data: { idProfessor: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#previous_text').attr('hidden', false);
            $('#student_app_photo').attr('hidden', true);
            $('#student_app_name').attr('hidden', true);
            $('#student_app_date').attr('hidden', true);
            $('#student_app_text').attr('hidden', true);
            $('#student_app_reply').attr('hidden', true);
            $('#student_app_answer').attr('hidden', true);
            $('#sender_app').attr('hidden', true);

            var htmlTable = '';

            $.each(result, function (index, item) {
                var uniqueId = "name_sender_" + index;

                htmlTable += '<tr>';
                htmlTable += '<td class="email-info">';
                if (item.status == 1) {
                    htmlTable += '<h3 style="font-style: italic">' + item.text + '</h3>';
                } else {
                    htmlTable += '<h3>' + item.text + '</h3>';
                }

                htmlTable += '<p id="' + uniqueId + '">Loading...</p>';
                htmlTable += '</td>';
                htmlTable += '<td class="email-action">';
                htmlTable += '<button class="btn btn-primary" onclick="LoadSpecificAppConsultation(' + item.id + ')">Open</button>';
                htmlTable += '</td>';
                htmlTable += '</tr>';


                LoadNameSender(item.idStudent, function (name) {
                    $("#" + uniqueId).text('From: ' + name);
                });
            });

            $('#email-table-appointment').empty();
            $('#email-table-appointment').html(htmlTable);
        },
        error: function (error) {
            alert(error)
        }
    })
}

function LoadNameSender(id, callback) {
    $.ajax({
        url: "/Student/GetStudentPhoto/" + id,
        type: "GET",
        data: { id: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            callback(result.name + ' ' + result.lastName)
        }, error: function (error) {

            callback('Error loading name');
        }
    });
}



function LoadSpecificAppConsultation(id) {
    $.ajax({
        url: "/ApplicationConsultation/GetById/" + id,
        type: "GET",
        data: { id: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#previous_text').attr('hidden', true);
            $('#student_app_photo').attr('hidden', false);
            $('#student_app_name').attr('hidden', false);
            $('#student_app_date').attr('hidden', false);
            $('#student_app_text').attr('hidden', false);
            $('#student_app_reply').attr('hidden', false);
            $('#student_app_answer').attr('hidden', false);
            $('#sender_app').attr('hidden', false);

            LoadNameSender(result.idStudent, function (name) {
                $('#student_app_name').text(name);
            });

            $('#student_app_date').text(result.date);
            $('#student_app_text').text(result.text);
            if (result.status == 1) {
                $('#student_app_answer').text(result.answer);
            }
            $('#student_app_idconsult').text(id.toString());
            $('#student_app_student').text(result.idStudent);
            $('#student_app_professor').text(result.idProfessor);
        }
    })
}

function PutAppConsultation() {
    var applicationConsultation = {
        id: $('#student_app_idconsult').text(),
        text: $('#student_app_text').text(),
        status: 1,
        answer: $('#student_app_answer').val(),
        idStudent: $('#student_app_student').text(),
        idProfessor: $('#student_app_professor').text(),
        date: $('#student_app_date').text()
    };

    $.ajax({
        url: "/ApplicationConsultation/Put",
        data: JSON.stringify(applicationConsultation),
        type: "PUT",
        contentType: "application/json",
        processData: false,
        dataType: "json",
        success: function (result) {
            alert('You answered the consultation successfully');
            LoadAppConsultations();

            answer: $('#student_app_answer').val('');
        },
        error: function (error) {
            alert(error);
        }
    })
}

function GetPrivateConsultations() {
    var id = $("#professorID").text().trim(); // Obtener ID del profesor

    $.ajax({
        url: "/PrivateConsultation/GetByProfessor/" + id,
        type: "GET",
        data: { idProfessor: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#previous_priv_text').attr('hidden', false);
            $('#student_private_photo').attr('hidden', true);
            $('#student_private_name').attr('hidden', true);
            $('#student_private_date').attr('hidden', true);
            $('#student_private_text').attr('hidden', true);
            $('#student_private_reply').attr('hidden', true);
            $('#student_private_answer').attr('hidden', true);
            $('#sender_private').attr('hidden', true);

            var htmlTable = '';

            $.each(result, function (index, item) {
                var uniqueId = "name_private_sender_" + index;

                htmlTable += '<tr>';
                htmlTable += '<td class="email-info">';
                if (item.status == 0) {
                    htmlTable += '<h3 style="font-weight: bold">' + item.text + '</h3>';
                } else {
                    htmlTable += '<h3>' + item.text + '</h3>';
                }
                htmlTable += '<p id="' + uniqueId + '"> Loading... </p>';
                htmlTable += '</td>';
                htmlTable += '<td class="email-action">';
                htmlTable += '<button class="btn btn-primary" onclick="LoadSpecificPrivateConsultation(' + item.id + ')"> Open </button>';
                htmlTable += '</td>';
                htmlTable += '</tr>';

                LoadNameSender(item.idStudent, function (name) {
                    $("#" + uniqueId).text('From: ' + name);
                });
            });

            $('#email-table-private').empty();
            $('#email-table-private').html(htmlTable);
        },
        error: function (error) {
            alert(error);
        }
    });
}

function LoadSpecificPrivateConsultation(id) {
    $.ajax({
        url: "/PrivateConsultation/GetById/" + id,
        type: "GET",
        data: { id: id },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#previous_priv_text').attr('hidden', true);
            $('#student_private_photo').attr('hidden', false);
            $('#student_private_name').attr('hidden', false);
            $('#student_private_date').attr('hidden', false);
            $('#student_private_text').attr('hidden', false);
            $('#student_private_reply').attr('hidden', false);
            $('#student_private_answer').attr('hidden', false);
            $('#sender_private').attr('hidden', false);

            LoadNameSender(result.idStudent, function (name) {
                $('#student_private_name').text(name);
            });

            $('#student_private_date').text(result.date); //TODO: MODIFY DATABASE
            $('#student_private_text').text(result.text);
            $('#student_private_idconsult').text(id.toString());
            $('#student_private_student').text(result.idStudent);
            $('#student_private_professor').text(result.idProfessor);
        }
    })
}

function PutPrivateConsultation() {
    var privateConsultation = {
        id: $('#student_private_idconsult').text(),
        text: $('#student_private_text').text(),
        status: 1,
        answer: $('#student_private_answer').val(),
        date: $('#student_private_date').text(),
        idStudent: $('#student_private_student').text(),
        idProfessor: $('#student_private_professor').text()
    };

    $.ajax({
        url: "/PrivateConsultation/Put",
        data: JSON.stringify(privateConsultation),
        type: "PUT",
        contentType: "application/json",
        processData: false,
        dataType: "json",
        success: function (result) {
            alert('You answered the consultation successfully');
            GetPrivateConsultations();

            answer: $('#student_app_answer').val('');
        },
        error: function (error) {
            alert(error);
        }
    })


    //Required for courses and course comments
    const closeButtons = document.querySelectorAll('.custom-modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.custom-modal');
            closeModal(modal);
        });
    });

    //Required for courses and course comments
    function closeModal(modal) {
        modal.style.display = 'none';
        navigationBar.style.display = 'block';
    }

}

