import { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';

import Footer from '../../../components/layout/Footer';

import './Faq.scss';

export default function Faq() {
    const [searchTerm, setSearchTerm] = useState('');

    const faqItems = [
        {
            title: "How can I change my password?",
            content: "To change your password, navigate to the 'Security and Privacy' section in your user settings. Enter your current password, followed by the new password and confirmation, and click 'Change Password'."
        },
        {
            title: "How do I delete my account?",
            content: "You can delete your account by going to the 'Security and Privacy' section, clicking 'Delete Account', entering your username, and confirming the action."
        },
        {
            title: "How do I update my profile image?",
            content: "Go to your user settings and click 'Change Image'. You can upload a new profile picture or delete your current one by clicking 'Delete Image'."
        },
        {
            title: "How do I manage my account categories?",
            content: "To manage categories, go to the 'Categories' section in your account settings. Here you can add, edit, or delete categories associated with your transactions."
        },
        {
            title: "What should I do if I forgot my password?",
            content: "Click on 'Forgot Password' on the login screen. Enter your email, and a reset token will be sent to you. Use that token to reset your password."
        },
        {
            title: "How do I see my financial transactions by year?",
            content: "You can view your financial transactions for a specific year by going to the 'Transactions' section. Select the year you want to filter, and all transactions for that year will be displayed."
        },
        {
            title: "How can I update my account language?",
            content: "To update your preferred language, navigate to your profile settings, select your language from the dropdown menu, and click 'Confirm Changes'."
        },
        {
            title: "Can I recover my account after deletion?",
            content: "No, once your account is deleted, it cannot be recovered. Make sure you have backed up any important information before proceeding."
        }
    ];

    const filteredFaqItems = faqItems.filter(faq =>
        faq.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="faq">
                <h1 className="title">Frequently Asked Questions</h1>

                <div className="faq-search">
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for a question..."
                        className="p-inputtext-lg"
                    />
                </div>

                <Accordion multiple>
                    {filteredFaqItems.map((faq, index) => (
                        <AccordionTab key={index} header={faq.title}>
                            <p>{faq.content}</p>
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>

            <Footer />
        </>
    );
}
