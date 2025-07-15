/*
 * @Author: pegazus-alpha pourdebutantp@gmail.com
 * @Date: 2025-07-13 04:37:27
 * @LastEditors: pegazus-alpha pourdebutantp@gmail.com
 * @LastEditTime: 2025-07-13 04:37:48
 * @FilePath: \panel\frontend\src\components\UI\Card.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/components/UI/Card.jsx
import React from "react";

export const Card = ({ title, children }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4">
            {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
            {children}
        </div>
    );
};
