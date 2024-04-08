import React, { useState, useRef, useEffect } from "react";
import "./Card.css"

const Card = ({ cardCode, cardImage}) => {

//cardRed is used to reference the DOM element where the card is rendered.
    const cardRef = useRef()

    const [{ xPosition, yPosition, angle }] = useState({
        xPosition: Math.random() * 40 - 20,
        yPosition: Math.random() * 40 - 20,
        angle: Math.random() * 90 - 45
    });

    useEffect(() => {
        const renderCard = () => {
            if (cardRef.current) {
                cardRef.current.innerHTML = "";
                const img = document.createElement("img");
                img.src = cardImage;
                img.alt = cardCode;
                img.style.transform = `translate(${xPosition}px, ${yPosition}px) rotate(${angle}deg)`;
                cardRef.current.appendChild(img);

            }
        };

        renderCard();
    }, [cardCode, cardImage, xPosition, yPosition, angle]);

    return (
        <div className="card" ref={cardRef}>
        </div>

    )
}

export default Card;