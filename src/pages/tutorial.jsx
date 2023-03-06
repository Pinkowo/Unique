import React from 'react';

const TutorialPage = () => {
    return (
        <div className="container">
            <div className='videobox'>
                <iframe
                    src="https://www.youtube.com/embed/ZaE2XYmPVFU"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    )
}

export default TutorialPage;