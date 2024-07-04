import { useState, ChangeEvent } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import "./Goals.scss";
import PlusIcon from "../../components/icons/PlusIcon";
import DeleteBinIcon from "../../components/icons/DeleteBinIcon";

interface Category {
  name: string;
  percentage: number;
}

function Goals() {
  const [salary, setSalary] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([
    { name: 'Life', percentage: 50 },
    { name: 'Expenses', percentage: 30 },
    { name: 'Savings', percentage: 10 },
    { name: 'Investment', percentage: 10 },
  ]);

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSalary(parseFloat(e.target.value) || 0);
  };

  const handleCategoryChange = (index: number, newPercentage: number) => {
    const newCategories = [...categories];
    const totalPercentage = newCategories.reduce((total, category, i) => {
      return i === index ? total + newPercentage : total + category.percentage;
    }, 0);

    if (totalPercentage > 100) {
      toast.error('The sum of all percentages cannot exceed 100%.');
      return;
    }

    newCategories[index].percentage = newPercentage;
    setCategories(newCategories);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', percentage: 0 }]);
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  return (
    <section className="goals">
      <Toaster />
      <div className="goals__main">
        <h2>Salary allowance</h2>

        <div className="goals__salary">
          Salary
          <input
            type="number"
            placeholder="Enter your salary"
            value={salary}
            onChange={handleSalaryChange}
          />
        </div>

        <div className="goals__categories">
          <div className='goals__categories-head'>
            <h4>Categories</h4>
            <PlusIcon onClick={handleAddCategory} />
          </div>

          {categories.map((category, index) => (
            <div key={index} className="goals__category">
              <input
                type="text"
                value={category.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newCategories = [...categories];
                  newCategories[index].name = e.target.value;
                  setCategories(newCategories);
                }}
                placeholder="Category name"
              />
              <input
                type="number"
                value={category.percentage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleCategoryChange(index, parseFloat(e.target.value) || 0)}
                placeholder="%"
              />
              <div className='goals__category-result'>
                <span>{((category.percentage / 100) * salary).toFixed(2)} €</span>
                <DeleteBinIcon onClick={() => handleRemoveCategory(index)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Goals;
