package vn.ssdc.vnpt.erp.core.rsql;

import cz.jirutka.rsql.parser.ast.ComparisonOperator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class GenericRsqlSpecification<T> implements Specification<T> {
    private static final Logger log = LoggerFactory.getLogger(GenericRsqlSpecification.class);
    private String property;
    private ComparisonOperator operator;
    private List<String> arguments;

    public GenericRsqlSpecification(
            String property, ComparisonOperator operator, List<String> arguments) {
        super();
        this.property = property;
        this.operator = operator;
        this.arguments = arguments;
    }

    @Override
    public Predicate toPredicate(
            Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        List<Object> args = castArguments(root);
        Object argument = args.get(0);
        switch (RsqlSearchOperation.getSimpleOperator(operator)) {

            case EQUAL: {
                Path path = root.<String>get(property);
                if("expression".equals(property)) {
                    String listArg[] = argument.toString().split(";");
                    for(int i = 0; i < listArg.length; i ++) {
                        if(listArg[i].indexOf("groupBy") > -1) {
                            if(!("").equals(listArg[i].split("==")[1])) {
                                query.groupBy(root.<String>get(listArg[i].split("==")[1]));
                            }
                        }
                        if(listArg[i].indexOf("orderBy") > -1) {
                            String condition = listArg[i].split("==")[1];
                            if(!("").equals(condition)) {
                                String conditions[] = condition.split(",");
                                if(conditions.length > 1 && ("desc").equals(conditions[1])) {
                                    query.orderBy(builder.desc(root.<String>get(conditions[0])));
                                }
                            }
                        }
                    }
                    break;
                }

                if (argument instanceof String) {
//                    Expression<Collection<String>> set = root.get(property);
//                    Path path = root.<String>get(property);
                    if(path.getJavaType() == Boolean.class) {
                        String tmp = (String)argument;
                        String val = "1".equals(tmp) ? "true" : ("0".equals(tmp) ? "false" : tmp);
                        return builder.equal(root.get(property),Boolean.valueOf(val));
                    }
                    if(("null").equals(argument)) {
                        return builder.isNull(root.get(property));
                    }
                    if(path.getJavaType() == Double.class) {
                        return builder.equal(root.get(property),Double.valueOf(argument.toString()));
                    }
                    if(path.getJavaType() == BigDecimal.class) {
                        return builder.equal(root.get(property),BigDecimal.valueOf(Long.parseLong(argument.toString())));
                    }

                    return builder.like(
                            root.<String> get(property), argument.toString().replace("%20"," ").replace('*', '%'));
                } else if (argument == null) {
                    return builder.isNull(root.get(property));
                } else {
                    return builder.equal(root.get(property), argument);
                }
            }
            case NOT_EQUAL: {
                if (argument instanceof String) {
                    return builder.notLike(
                            root.<String> get(property), argument.toString().replace("%20"," ").replace('*', '%'));
                } else if (argument == null) {
                    return builder.isNotNull(root.get(property));
                } else {
                    return builder.notEqual(root.get(property), argument);
                }
            }
            case GREATER_THAN: {
                return builder.greaterThan(root.<String> get(property), argument.toString());
            }
            case GREATER_THAN_OR_EQUAL: {
                return builder.greaterThanOrEqualTo(
                        root.<String> get(property), argument.toString());
            }
            case LESS_THAN: {
                return builder.lessThan(root.<String> get(property), argument.toString());
            }
            case LESS_THAN_OR_EQUAL: {
                return builder.lessThanOrEqualTo(
                        root.<String> get(property), argument.toString());
            }
            case IN:
                return root.get(property).in(args);
            case NOT_IN:
                return builder.not(root.get(property).in(args));
        }

        return null;
    }

    private List<Object> castArguments(Root<T> root) {
        List<Object> args = new ArrayList<Object>();
        Class<? extends Object> type = root.get(property).getJavaType();

        for (String argument : arguments) {
            if (type.equals(Integer.class)) {
                if(!("null").equals(argument)) {
                    args.add(Integer.parseInt(argument));
                }
                else {
                    args.add(null);
                }
            } else if (type.equals(Long.class)) {
                if(!("null").equals(argument)) {
                    args.add(Long.parseLong(argument));
                }
                else {
                    args.add(null);
                }
            } else {
                args.add(argument);
            }
        }

        return args;
    }
}
