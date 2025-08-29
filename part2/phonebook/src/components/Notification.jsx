const Notification = ({ message, type = 'error' }) => {
    if (message === null) {
        return null
    }

    const className = type === 'success' ? 'success' : 'error'

    return <div className={className}>{message}</div>
}

export default Notification