package vn.ssdc.vnpt.erp.core.compares;

import org.javers.core.diff.changetype.ValueChange;
import org.javers.core.diff.custom.CustomPropertyComparator;
import org.javers.core.metamodel.object.GlobalId;
import org.javers.core.metamodel.property.Property;

import java.math.BigDecimal;

public class CustomBigDecimalComparator implements CustomPropertyComparator<BigDecimal, ValueChange>
{
    private int significantDecimalPlaces;

    public CustomBigDecimalComparator(int significantDecimalPlaces) {
        this.significantDecimalPlaces = significantDecimalPlaces;
    }

    @Override
    public ValueChange compare(BigDecimal left, BigDecimal right, GlobalId affectedId,
                               Property property)
    {
        left = left==null?BigDecimal.ZERO:left.setScale(0,BigDecimal.ROUND_DOWN);
        right = right==null?BigDecimal.ZERO:right.setScale(0,BigDecimal.ROUND_DOWN);

        if (left.equals(right)){
            return null;
        }

        return new ValueChange(affectedId, property.getName(), left, right);
    }

}