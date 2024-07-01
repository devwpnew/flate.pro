import { useSelector } from "react-redux";

import ProductItemRow from "./layout/productItemRow";
import ProductItemHorizontal from "./layout/productItemHorizontal";
import ProductItemSettings from "./layout/productItemSettings";
import ProductItemFavorite from "./layout/productItemFavorite";
import ProductItemGrid from "./layout/productItemGrid";

export default function ProductItem({
    hotDeal,
    product,
    layout,
    isModeration,
    hideUserInfo,
}) {
    const user = useSelector((state) => state.userLogin.value);

    if (layout === "horisontal") {
        return <ProductItemHorizontal user={user} product={product} />;
    }

    if (layout === "settings") {
        return (
            <ProductItemSettings
                user={user}
                product={product}
                isModeration={isModeration}
            />
        );
    }

    if (layout === "favorite") {
        return <ProductItemFavorite user={user} product={product} />;
    }

    if (layout === "row") {
        return (
            <ProductItemRow
                hideUserInfo={hideUserInfo}
                user={user}
                product={product}
            />
        );
    }

    return <ProductItemGrid user={user} hotDeal={hotDeal} product={product} />;
}
