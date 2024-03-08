import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { memoCard } from '../../types';

const NUM_CARDS = 8;
const MAX_MOVES = 10;

const images: any = {
  'reindeer': require('../../assets/reindeer1.png'),
  'giftbox': require('../../assets/giftbox1.png'),
  'santa-claus': require('../../assets/santa-claus1.png'),
  'christmas-tree': require('../../assets/christmas-tree1.png'),
};

const names: string[] = Object.keys(images);

export default function Game() {
  const [cards, setCards] = useState<memoCard[]>([]);
  const [flippedCount, setFlippedCount] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<memoCard[]>([]);
  const [movesCounter, setMovesCounter] = useState<number>(MAX_MOVES);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    const initialCards: memoCard[] = [];
    for (let i = 0; i < NUM_CARDS / 4; i++) {
      names.forEach((name) => {
        initialCards.push({ name, flipped: false });
      });
    }
    setCards(initialCards.sort(() => Math.random() - 0.5));

    return () => {
      setCards([]);
      setFlippedCount(0);
      setSelectedCards([]);
      setMovesCounter(MAX_MOVES);
      setGameOver(false);
      setGameWon(false);
    };
  }, []);
  useEffect(() => {
    const flippedCardsCount = cards.filter(card => card.flipped).length;
    if (flippedCardsCount === NUM_CARDS && flippedCount === 0) {
      setGameWon(true);
    }
  }, [cards, flippedCount]);

  useEffect(() => {
    if (flippedCount === 2) {
      const [card1, card2] = selectedCards;
      if (card1.name !== card2.name) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.name === card1.name || card.name === card2.name ? { ...card, flipped: false } : card
            )
          );
        }, 1000);
      }
      setSelectedCards([]);
      setFlippedCount(0);
      setMovesCounter((prevMovesCounter) => prevMovesCounter - 1);
    }
  }, [flippedCount]);

  useEffect(() => {
    if (movesCounter === 0 && !cards.every((card) => card.flipped)) {
      setGameOver(true);
    }
  }, [cards, movesCounter]);

  const handleCardPress = (index: number) => {
    if (!cards[index].flipped && flippedCount < 2) {
      setCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, flipped: true } : card))
      );
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, cards[index]]);
      setFlippedCount((prevFlippedCount) => prevFlippedCount + 1);
    }
  };

  const handleRestartGame = () => {
    setFlippedCount(0);
    setMovesCounter(MAX_MOVES);
    setGameOver(false);
    setGameWon(false);
    const initialCards: memoCard[] = [];
    for (let i = 0; i < NUM_CARDS / 4; i++) {
      names.forEach((name) => {
        initialCards.push({ name, flipped: false });
      });
    }
    setCards(initialCards.sort(() => Math.random() - 0.5));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Christmas Memory Game</Text>
      <Text>Moves Left: {movesCounter}</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, card.flipped && styles.cardFlipped]}
            onPress={() => handleCardPress(index)}
            activeOpacity={0.8}>
            {card.flipped && <Image style={styles.memoImage} source={images[card.name]} />}
          </TouchableOpacity>
        ))}
      </View>
      {gameOver && (
        <View>
          <Text style={styles.resultText}>You lost!</Text>
          <Button title="Restart Game" onPress={handleRestartGame} />
        </View>
      )}
            {gameWon && (
        <View>
          <Text style={styles.resultText}>You won! Your code is CODE</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      width: 80,
      height: 80,
      backgroundColor: '#b51414',
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: '#000',
      borderRadius: 5,
    },
    cardFlipped: {
      backgroundColor: '#ccc',
    },
    name: {
      fontSize: 24,
    },
    memoImage: {
      width: 60,
      height: 60,
    },
    resultText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
    },
  });