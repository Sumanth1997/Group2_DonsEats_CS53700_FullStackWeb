import React from 'react';
import '../styles/OfferSection.css';

const offers = [
  { title: 'Teacher\'s Pet Special', discount: '-20%', imageUrl: 'teachers-pet.jpg' },
  { title: 'Buy 1 Get 1 on Coffee', discount: 'BOGO', imageUrl: 'coffee-bogo.jpg' },
  { title: 'Free Muffin with Large Coffee', discount: 'FREE', imageUrl: 'free-muffin.jpg' },
];

const OfferSection = () => {
  return (
    <section className="offer-section">
      {offers.map((offer, index) => (
        <div key={index} className="offer-card">
          <img src={offer.imageUrl} alt={offer.title} />
          <div className="offer-details">
            <h3>{offer.title}</h3>
            <span>{offer.discount}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

export default OfferSection;
