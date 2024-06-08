const Notification = ({ message}) => {

    if (message === null){
        return null
    }

    if (message.toLowerCase().includes('information')){
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