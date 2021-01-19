new window.EventSource('/sse').onmessage = function (event) {
    console.log('eventdata ' , event.data);
    document.getElementById("newMSG").innerHTML += `<p>${event.data}</p>`
}

window.form.addEventListener('submit', function (evt) {
    evt.preventDefault()

    window.fetch(`/chat?message=${window.input.value}`)
    window.input.value = ''
})