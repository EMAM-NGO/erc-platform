import React from 'react';
import { Link } from 'react-router-dom';

type WorkshopCardProps = {
  id: string;
  title: string;
  date: string;
  hosts: string;
  description: string;
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({ id, title, date, hosts, description }) => {
  return (
    <Link to={`/workshops/${id}`} className="block bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl">
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">{date}</p>
        <p className="text-text-main-light dark:text-text-main-dark mb-4">{description}</p>
        <p className="text-sm font-semibold text-text-muted-light dark:text-text-muted-dark">Hosted by: {hosts}</p>
      </div>
      <div className="bg-background-light dark:bg-background-dark p-4 text-center">
        <span className="text-sm font-medium text-primary">View Details</span>
      </div>
    </Link>
  );
};

export default WorkshopCard;