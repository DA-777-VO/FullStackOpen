const Notification = ({ message}) => {

    if (message === null){
        return null
    }

    if (message.toLowerCase().includes('information')
        || message.toLowerCase().includes('validation')
        || message.toLowerCase().includes('missing')
    ){
        return (
            <div className='notificationErrorMessage'>
                {message}
            </div>
        )
    } else
        return (
            <div className='notificationMessage'>
                {message}
            </div>
        )
}

export default Notification