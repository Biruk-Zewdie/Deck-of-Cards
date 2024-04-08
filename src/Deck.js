import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./Deck.css"
import Card from "./Card";
import axios from "axios"

/*Three state hooks used:
    1. store the current deck Id 
    2. store the array of objects of that are representing the cards that have been drawn.
    3.updates the remaining cards when a card is drawn from the deck and when the deck is empty it will alert.

1 ref hook used:
    - used to reference the DOM element where the cards are rendered.
 */

const Deck = () => {
    const [deckId, setDeckId] = useState(null);
    const [drawnCard, setDrawnCard] = useState([]);
    const [remainingCards, setRemainingCard] = useState(null)
    const cardRef = useRef();

/*========================fetches a single card from the deck using the Deck of Cards API.=============================*/

    const drawCard = async () => {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)

        if (response.data.success) {
            const newCard = {
                cardCode: response.data.cards[0].code,
                cardImage: response.data.cards[0].image,
                id: uuidv4()
            }
            setDrawnCard((prevDrawnCards) => [...prevDrawnCards, newCard])
            setRemainingCard(response.data.remaining)
        } else {
            console.error("faild to draw", response.data.error);
        }
    }

/*========================Asynchronous function reshuffles the deck using the Deck of Cards API==========================*/

    const reshuffleCards = async () => {
        //calls removeAllCards to clear any existing cards from the DOM.
        await removeAllCards();
        const response = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
        )
        if (response.data.success) {
        //the drawnCard array is cleared, and the remainingCards state is updated.
            setDrawnCard([]);
            if (remainingCards === 0) {
                setRemainingCard(response.data.remaining)
            }
        }
    }

/*==========fetching a new deck ID from the Deck of Cards API when the component mounts or when deckId changes.===============*/

    useEffect(() => {
        const getDeckId = async () => {
            const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle")
            if (response.data.success) {
                setDeckId(response.data.deck_id)
                setRemainingCard(response.data.remaining)
            } else {
                console.error("failed to fetch deck_id", response.data.error)
            }
        }

        //If deckId is falsy, it means that the component is being rendered for the first time (or deckId has not been set yet).
        //If we are used the conditional it reanders new deckId while we draw a card 
        if (!deckId) {
            getDeckId()
        }
    }, [deckId])

/*================================ handles clicking of  "Draw a card" and "Shuffle Deck!" button =================================*/

    const drawBtnClick = async () => {
        if (remainingCards <= 0) {
            alert("Error: no cards remaining!")
            return;                             // Exit the function early if no cards remaining
        } else {
            await drawCard();
        }
    }

    const handleShuffleBtn = async () => {
        await reshuffleCards()
    }
/*=================== removes all cards from the DOM by clearing the inner HTML of the cardRef element ===========================*/

    const removeAllCards = () => {
        if (cardRef.current) {
            cardRef.current.innerHTML = "";
        }
    }
    //ensures that any existing cards are removed from the DOM when the deckId changes.
    useEffect(() => {
        if (deckId)
            removeAllCards()

    }, [deckId])

/*==================================== renders the two buttons and the card component ======================================*/

    return (
        <div>
            <button className="drawBtn" onClick={drawBtnClick}>Draw a Card</button>
            <button className="reshuffleBtn" onClick={handleShuffleBtn}>Shuffle Deck!</button>
            <div className="card">
                {drawnCard.map(({cardCode, cardImage, id}) => (
                    <Card codeCode ={cardCode} cardImage= {cardImage} key = {id} />
                ))}
            </div>
        </div>
    )


}

export default Deck; 