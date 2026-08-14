import React from 'react';
import './StackedCards.css';

const cardData = [
  {
    number: "01",
    title: "TED",
    description: "TED is a nonprofit, nonpartisan organization dedicated to discovering, debating and spreading ideas that spark conversation, deepen understanding and drive meaningful change. Our organization is devoted to curiosity, reason, wonder and the pursuit of knowledge — without an agenda. We welcome people from every discipline and culture who seek a deeper understanding of the world and connection with others, and we invite everyone to engage with ideas and activate them in your community.",
    variant: "white"
  },
  {
    number: "02",
    title: "TEDx",
    description: "In the spirit of discovering and spreading ideas, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection. These local, self-organized events are branded TEDx, where x = independently organized TED event. The TED Conference provides general guidance for the TEDx program, but individual TEDx events are self-organized. (Subject to certain rules and regulations.)",
    variant: "dark"
  },
  {
    number: "03",
    title: "TEDxTIET",
    description: "TEDxTIET is an annual independently organized TED event that commenced in 2015. It is driven by a dedicated team of passionate volunteers, comprising undergraduate and post-graduate students of Thapar Institute of Engineering and Technology (TIET). The main conference at TEDxTIET is a culmination of months of meticulous preparation, bringing together visionaries, innovators, and changemakers for an extraordinary day of exploration and inspiration. Set against the backdrop of Thapar University in Patiala, this event transcends traditional conferences, embodying a celebration of human creativity and resilience.",
    variant: "white"
  }
];

const StackedCards = () => {
  return (
    <section className="stacked-section" id="aboutus">
      <div className="stacked-wrapper">
        <div className="stacked-cards-container">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`stacked-card card-${card.variant}`}
              style={{ zIndex: 10 + index }}
            >
              <div className="card-content">
                <h2 className="card-title">
                  <span>{card.number}</span> {card.title}
                </h2>
                <p className="card-desc">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackedCards;