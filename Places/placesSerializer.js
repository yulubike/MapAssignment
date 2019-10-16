function serializePlaceShort(req, place) {
    return {
        id: place._id,
        title: place.title,
        latitude: place.latitude,
        longitude: place.longitude,
        imageUrl: place.image ? '/image/' + place.image : undefined
    };
}

function serializePlace(req, place) {
    return {
        id: place._id,
        title: place.title,
        latitude: place.latitude,
        longitude: place.longitude,
        imageUrl: place.image ? '/image/' + place.image : undefined,
        description: place.description ? place.description : undefined
    };
}

module.exports = {
    serializePlaceShort,
    serializePlace
}
