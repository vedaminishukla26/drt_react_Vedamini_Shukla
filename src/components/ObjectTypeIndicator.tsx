const ObjectTypeIndicator = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'active':
                return 'bg-blue-500';
            case 'debris':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
    );
};

export default ObjectTypeIndicator;