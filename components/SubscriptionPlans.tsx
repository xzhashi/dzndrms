import React from 'react';
import { ShieldCheckIcon, SparklesIcon, DiamondIcon } from './icons';

const plans = [
    {
        name: 'Basic',
        price: 'Free',
        features: ['Up to 3 active listings', 'Standard placement', 'Basic support'],
        icon: DiamondIcon,
        cta: 'Current Plan',
        isCurrent: true,
    },
    {
        name: 'Pro',
        price: '$99/mo',
        features: ['Up to 20 active listings', 'Higher search placement', '2 listing boosts per month', 'Priority support'],
        icon: SparklesIcon,
        cta: 'Upgrade to Pro',
        isCurrent: false,
    },
    {
        name: 'Premium',
        price: '$249/mo',
        features: ['Unlimited active listings', 'Top-tier placement', '10 listing boosts per month', 'Dedicated account manager', 'Access to market insights'],
        icon: ShieldCheckIcon,
        cta: 'Go Premium',
        isCurrent: false,
    }
];

export const SubscriptionPlans: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Manage Subscription</h3>
            <p className="text-slate-500 mb-8">Choose a plan that fits your needs to unlock more features and visibility.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => {
                    const Icon = plan.icon;
                    return (
                        <div key={plan.name} className={`rounded-xl p-6 border transition-all duration-300 ${plan.isCurrent ? 'border-violet-500 shadow-2xl shadow-violet-500/20' : 'border-slate-200 bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                                <Icon className={`w-8 h-8 ${plan.isCurrent ? 'text-violet-500' : 'text-slate-400'}`} />
                                <h4 className="text-xl font-bold text-slate-800">{plan.name}</h4>
                            </div>
                            <p className="text-3xl font-extrabold text-slate-900 my-4">{plan.price}</p>
                            <ul className="space-y-3 text-slate-600 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <ShieldCheckIcon className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                disabled={plan.isCurrent}
                                className={`w-full mt-8 py-2.5 font-semibold rounded-lg transition-all duration-300 text-sm
                                    ${plan.isCurrent
                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                        : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};