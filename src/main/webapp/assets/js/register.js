async function register(){

    Notiflix.Loading.pulse("Loading...", {
        clickToClose: false,
        svgColor: '#0284c7'
    });

    let fname = document.getElementById("fname");
    let lname = document.getElementById("lname");
    let email = document.getElementById("regEmail");
    let password = document.getElementById("regPassword");

    const user ={
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        password: password.value
    }

    try{

        const response = await fetch("api/users",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(user)
        });

        Notiflix.Loading.pulse("wait...");

        if(response.ok){

            Notiflix.Loading.remove(1000)


            const data = await response.json();


            if(data.status){
                Notiflix.Report.success(
                    'OpenBay',
                    data.message,
                    'Confirmation Message',
                    () => {
                        window.location.href =
                            "Verify.html?email=" + encodeURIComponent(email.value);
                    }
                );
            }else{
                Notiflix.Notify.failure(data.message);
            }

        }else{
            Notiflix.Notify.failure('Something went wrong. Please check your credentials');
        }

    }catch (e){
        Notiflix.Notify.failure(e.message);

    }finally {
        Notiflix.Loading.remove();
    }


}